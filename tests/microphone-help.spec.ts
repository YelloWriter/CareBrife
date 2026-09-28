import { test, expect } from '@playwright/test';

test('permission help can be reopened, changed, closed and used to retry without recording on open', async ({ page }) => {
  await page.addInitScript(() => {
    delete (Navigator.prototype as { gpu?: unknown }).gpu;
    let attempts = 0;
    class Speech {
      onstart?: () => void; onresult?: (e: unknown) => void; onend?: () => void; onerror?: (e: { error:string }) => void;
      start() { attempts++; document.body.dataset.attempts = String(attempts); if(attempts === 1) this.onerror?.({error:'not-allowed'}); else { this.onstart?.(); this.onresult?.({results:[{isFinal:true,0:{transcript:'무릎이 불편해요.'}}]}); } }
      stop() { this.onend?.(); } abort() {}
    }
    Object.defineProperty(window,'SpeechRecognition',{value:Speech});
  });
  await page.goto('/#create-report');
  await page.getByRole('button',{name:'진료한장 만들기',exact:true}).click();
  await page.getByRole('button',{name:'글로 입력',exact:true}).click();
  await page.getByLabel('전하고 싶은 이야기').fill('미리 작성한 내용입니다.');
  await page.getByRole('button',{name:'말로 입력',exact:true}).click();
  await page.getByRole('button',{name:'녹음 시작'}).click();
  const trigger = page.getByRole('button',{name:'권한 설정 확인하기'});
  await expect(trigger).toBeVisible();
  await trigger.click();
  const modal = page.getByRole('dialog',{name:'마이크 권한을 확인해 주세요'});
  await expect(modal).toBeVisible();
  await expect(page.locator('body')).toHaveAttribute('data-attempts','1');
  await expect(page.getByLabel('사용 중인 기기와 브라우저')).toHaveValue('desktop');
  await page.screenshot({path:'test-results/microphone-help-mobile.png'});
  await page.getByLabel('사용 중인 기기와 브라우저').selectOption('ios');
  await expect(modal).toContainText('웹사이트 설정');
  await page.getByLabel('사용 중인 기기와 브라우저').selectOption('android');
  await expect(modal).toContainText('사이트 설정 → 마이크');
  await page.getByLabel('사용 중인 기기와 브라우저').selectOption('safari');
  await expect(modal).toContainText('Safari → 설정 → 웹사이트');
  await page.getByText('허용했는데도 작동하지 않나요?').click();
  await expect(modal).toContainText('앱 안의 브라우저');
  for(const width of [320,390,1440]) {
    await page.setViewportSize({width,height:740});
    const box=await modal.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.width).toBeLessThanOrEqual(width);
    expect(box!.height).toBeLessThanOrEqual(740);
  }
  await page.keyboard.press('Escape');
  await expect(modal).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(modal).toBeVisible();
  await page.getByRole('button',{name:'권한 안내 닫기',exact:true}).click();
  await trigger.click();
  await page.getByRole('button',{name:'설정 후 다시 녹음하기',exact:true}).click();
  await expect(modal).toHaveCount(0);
  await expect(page.locator('.bf-app')).toHaveAttribute('data-screen','recording');
  await expect(page.locator('body')).toHaveAttribute('data-attempts','2');
  await page.getByRole('button',{name:'녹음 마치기'}).click();
  await expect(page.getByLabel('가장 전하고 싶은 내용',{exact:true})).toHaveValue(/미리 작성한 내용입니다/);
});
