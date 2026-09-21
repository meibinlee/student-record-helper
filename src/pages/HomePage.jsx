import Header from '../components/Header'
import SiteFooter from '../components/SiteFooter'

function HomePage({ onSelectPage }) {
  return (
    <div className="app">
      <Header />

      <main>
        <section className="hero">
          <p className="hero-label">
            학교생활기록부 작성 지원
          </p>

          <h1>
            필요한 생기부 프롬프트를
            <br />
            간편하게 만들어 보세요.
          </h1>

          <p className="hero-description">
            학교생활기록부 작성에 활용할 수 있는 AI 프롬프트를 제공합니다.
            <br />
            원하는 영역을 선택하고 프롬프트를 복사해 ChatGPT, Gemini 등에서
            사용할 수 있습니다.
          </p>
        </section>

        <section className="prompt-section">
          <div className="section-title">
            <h2>어떤 기록을 작성하시나요?</h2>
            <p>필요한 영역을 선택하세요.</p>
          </div>

          <div className="card-grid">
            <button
              type="button"
              className="prompt-card"
              onClick={() => onSelectPage('subject')}
            >
              <div className="card-icon">📘</div>
              <h3>교과 세특</h3>
              <p>
                교과 세부능력 및 특기사항 작성 프롬프트
              </p>
              <span>프롬프트 만들기 →</span>
            </button>

            <button
              type="button"
              className="prompt-card"
              disabled
            >
              <div className="card-icon">👤</div>
              <h3>행동특성 및 종합의견</h3>
              <p>
                학생의 관찰 내용을 바탕으로 한 작성 프롬프트
              </p>
              <span>준비 중</span>
            </button>

            <button
              type="button"
              className="prompt-card"
              disabled
            >
              <div className="card-icon">🎨</div>
              <h3>동아리 활동</h3>
              <p>
                동아리 활동 특기사항 작성 프롬프트
              </p>
              <span>준비 중</span>
            </button>

            <button
              type="button"
              className="prompt-card"
              disabled
            >
              <div className="card-icon">🌱</div>
              <h3>창의적 체험활동</h3>
              <p>
                자율·진로 활동 등의 특기사항 작성 프롬프트
              </p>
              <span>준비 중</span>
            </button>
          </div>
        </section>

        <section className="notice">
          <strong>안내</strong>

          <p>
            이 사이트는 학교생활기록부 작성을 위한 AI 프롬프트를 제공하는
            도구입니다. 생성된 결과는 실제 관찰 및 평가 내용과 일치하는지
            교사가 최종 확인해야 합니다.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default HomePage