function PromptResult({
  prompt,
  copied,
  onCopy,
}) {
  if (!prompt) return null

  return (
    <section
      className="result-card"
      id="prompt-result"
    >
      <div className="result-heading">
        <div>
          <p className="result-label">완성</p>

          <h2>AI에 붙여넣을 프롬프트</h2>

          <p>
            아래 내용을 복사해 ChatGPT, Gemini 등에서 사용하세요.
          </p>
        </div>

        <button
          type="button"
          className="copy-button"
          onClick={onCopy}
        >
          {copied ? '✓ 복사됨' : '📋 프롬프트 복사'}
        </button>
      </div>

      <textarea
        className="prompt-output"
        value={prompt}
        readOnly
      />

      <div className="result-notice">
        <strong>사용 전 확인해 주세요.</strong>

        <p>
          AI가 생성한 문장은 초안입니다. 실제 수업 및 평가 과정에서
          관찰한 사실과 일치하는지 확인한 후 사용하세요. AI가 계산한
          바이트 수는 실제 NEIS 계산 결과와 차이가 있을 수 있습니다.
        </p>
      </div>
    </section>
  )
}

export default PromptResult