import { Heart, UsersRound, FileCheck2 } from "lucide-react";
import { Card } from "../ui/card";

export default function FeaturesSection() {
  return (
        <section className="value-section landing" aria-labelledby="value-title">
          <div className="section-heading">
            <p className="section-kicker">ONE CARING PAGE</p>
            <h2 id="value-title">
              진료한장은 부모님의 이야기를
              <br />
              진료에 쓸 수 있는 <span>한 장</span>으로 정리해요.
            </h2>
          </div>
          <div className="value-grid">
            <Card role="article" className="gap-0 shadow-none">
              <div className="value-icon">
                <Heart size={25} aria-hidden="true" />
              </div>
              <h3>편하게 이야기하기</h3>
              <p>
                부모님이 직접 불편한 점을 말씀하시거나, 자녀가 대신 입력할 수
                있어요. 꼭 정확한 문장으로 말하지 않아도 괜찮아요.
              </p>
            </Card>
            <Card role="article" className="gap-0 shadow-none">
              <div className="value-icon">
                <UsersRound size={25} aria-hidden="true" />
              </div>
              <h3>함께 확인하기</h3>
              <p>
                증상, 복용 중인 약, 최근 달라진 점과 궁금한 내용을 자녀가
                확인하고 필요한 부분을 더할 수 있어요.
              </p>
            </Card>
            <Card role="article" className="gap-0 shadow-none">
              <div className="value-icon">
                <FileCheck2 size={25} aria-hidden="true" />
              </div>
              <h3>한 장으로 챙겨가기</h3>
              <p>
                병원에서 빠르게 볼 수 있도록 중요한 내용만 한 장으로 정리해
                가족에게 보내거나 직접 가져갈 수 있어요.
              </p>
            </Card>
          </div>
          <p className="value-note">
            함께 병원에 가지 못하는 날에도, 진료 준비까지 혼자 맡겨두지
            않으셔도 괜찮아요.
          </p>
        </section>
  );
}
