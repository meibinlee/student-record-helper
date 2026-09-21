function Header({ onBack }) {
  return (
    <header className="header">
      <div className="header-inner">
        {onBack ? (
          <button
            type="button"
            className="back-button"
            onClick={onBack}
          >
            ← 홈으로
          </button>
        ) : (
          <div className="header-side" />
        )}

        <div className="logo">생기부 프롬프트 도우미</div>

        {onBack ? (
          <div className="header-side" />
        ) : (
          <div className="header-badge">For Teachers</div>
        )}
      </div>
    </header>
  )
}

export default Header