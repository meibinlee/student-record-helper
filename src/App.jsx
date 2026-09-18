import { useState } from 'react'
import './App.css'

function App() {
  const [page, setPage] = useState('home')

  if (page === 'subject') {
    return <SubjectPromptPage onBack={() => setPage('home')} />
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">생기부 프롬프트 도우미</div>
          <div className="header-badge">For Teachers</div>
        </div>
      </header>

      <main>
        <section className="hero">
          <p className="hero-label">학교생활기록부 작성 지원</p>

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
              className="prompt-card"
              onClick={() => setPage('subject')}
            >
              <div className="card-icon">📘</div>
              <h3>교과 세특</h3>
              <p>교과 세부능력 및 특기사항 작성 프롬프트</p>
              <span>프롬프트 만들기 →</span>
            </button>

            <button className="prompt-card">
              <div className="card-icon">👤</div>
              <h3>행동특성 및 종합의견</h3>
              <p>학생의 관찰 내용을 바탕으로 한 작성 프롬프트</p>
              <span>준비 중</span>
            </button>

            <button className="prompt-card">
              <div className="card-icon">🎨</div>
              <h3>동아리 활동</h3>
              <p>동아리 활동 특기사항 작성 프롬프트</p>
              <span>준비 중</span>
            </button>

            <button className="prompt-card">
              <div className="card-icon">🌱</div>
              <h3>창의적 체험활동</h3>
              <p>자율·진로 활동 등의 특기사항 작성 프롬프트</p>
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

      <footer>
        <p>생기부 프롬프트 도우미</p>
      </footer>
    </div>
  )
}

function SubjectPromptPage({ onBack }) {
  const [schoolLevel, setSchoolLevel] = useState('중학교')
  const [grade, setGrade] = useState('1학년')
  const [subject, setSubject] = useState('')
  const [targetBytes, setTargetBytes] = useState(1000)

  const [topPerformance, setTopPerformance] = useState('')
  const [emphasis, setEmphasis] = useState('')

  const [identityType, setIdentityType] = useState('none')

  const [students, setStudents] = useState([
    {
      id: 1,
      number: '',
      name: '',
      level: '',
      observation: '',
    },
  ])

  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const addStudent = () => {
    setStudents([
      ...students,
      {
        id: Date.now(),
        number: '',
        name: '',
        level: '',
        observation: '',
      },
    ])
  }

  const updateStudent = (id, field, value) => {
    setStudents(
      students.map((student) =>
        student.id === id
          ? { ...student, [field]: value }
          : student
      )
    )
  }

  const removeStudent = (id) => {
    if (students.length === 1) return

    setStudents(students.filter((student) => student.id !== id))
  }

  const makeStudentText = () => {
    return students
      .map((student, index) => {
        let identity = `학생 ${index + 1}`

        if (identityType === 'number' && student.number.trim()) {
          identity = `학번 ${student.number.trim()}`
        }

        if (identityType === 'name') {
          const numberText = student.number.trim()
            ? `학번 ${student.number.trim()}`
            : ''

          const nameText = student.name.trim()
            ? `이름 ${student.name.trim()}`
            : ''

          const combinedIdentity = [numberText, nameText]
            .filter(Boolean)
            .join(' / ')

          if (combinedIdentity) {
            identity = combinedIdentity
          }
        }

        return `[${identity}]
성취수준: ${student.level.trim()}
실제 관찰 특성: ${
          student.observation.trim()
            ? student.observation.trim()
            : '별도 입력 없음'
        }`
      })
      .join('\n\n')
  }

  const generatePrompt = () => {
    setError('')
    setCopied(false)

    if (!subject.trim()) {
      setError('교과명을 입력해 주세요.')
      return
    }

    if (
      !targetBytes ||
      Number(targetBytes) < 1 ||
      Number(targetBytes) > 1500
    ) {
      setError('목표 분량은 1~1500바이트 사이로 입력해 주세요.')
      return
    }

    const emptyLevelStudent = students.find(
      (student) => !student.level.trim()
    )

    if (emptyLevelStudent) {
      setError('모든 학생의 성취수준을 입력해 주세요.')
      return
    }

    const studentText = makeStudentText()

    const prompt = `당신은 교사의 학교생활기록부 작성을 보조하는 역할입니다.

아래에 제공되는 교사의 수업 및 평가 자료를 바탕으로 각 학생의 '교과 세부능력 및 특기사항'을 작성하세요.

중요한 원칙은 학생별로 제공된 성취수준과 실제 관찰 내용을 근거로 작성하는 것입니다. 제공되지 않은 학생의 활동, 태도, 역할, 능력, 성취 등을 임의로 추측하거나 사실처럼 만들어 내지 마세요.


[기본 정보]

학교급: ${schoolLevel}
학년: ${grade}
교과명: ${subject.trim()}

학생 1명당 목표 분량: NEIS 기준 약 ${targetBytes}바이트

바이트 계산 기준:
- 한글: 3바이트
- 영문, 숫자, 특수문자, 띄어쓰기: 1바이트
- 줄바꿈: 2바이트

목표 분량에 가능한 한 가깝게 작성하되 ${targetBytes}바이트를 초과하지 않도록 하세요.
분량을 맞추기 위해 제공되지 않은 사실을 추가하거나 동일한 내용을 반복하지 마세요.
분량과 사실성이 충돌하는 경우 사실성을 우선하세요.


[최상위 성취수준의 기대 수행 특성]

${
  topPerformance.trim()
    ? topPerformance.trim()
    : '별도로 제공하지 않음'
}


[성취수준 적용 원칙]

위의 '최상위 성취수준의 기대 수행 특성'이 제공된 경우, 이를 최상위 성취수준 학생의 수행 정도를 판단하기 위한 기준점으로 활용하세요.

모든 학생에게 최상위 수행 특성을 동일하게 적용하지 말고, 각 학생에게 입력된 성취수준에 맞게 성취 정도와 표현의 수준을 조절하세요.

단, 하위 성취수준에 대한 구체적인 수행 특성이 별도로 제공되지 않았으므로 특정 활동이나 능력을 임의로 만들어 내지 마세요.

학생별 실제 관찰 특성이 제공된 경우 이를 가장 우선적인 작성 근거로 사용하세요.

학생의 실제 관찰 특성이 '별도 입력 없음'인 경우에는 해당 학생의 성취수준과 제공된 교과 기준을 바탕으로 일반적인 성취 정도를 표현할 수 있습니다.

그러나 성취수준만을 근거로 적극성, 협력성, 발표 태도, 모둠 활동 참여, 친구를 도와주는 행동 등 관찰되지 않은 특성을 임의로 추가하지 마세요.


[특히 강조하고 싶은 내용]

${
  emphasis.trim()
    ? emphasis.trim()
    : '별도로 제공하지 않음'
}


[학생 정보]

${studentText}


[작성 원칙]

1. 사용자가 제공한 사실을 가장 중요한 근거로 작성하세요.

2. 제공되지 않은 구체적인 활동, 역할, 태도, 행동을 임의로 추가하지 마세요.

3. 학생의 성취수준과 실제 관찰 내용을 자연스럽게 연결하세요.

4. 학생마다 개별적인 특징이 드러나도록 작성하세요.

5. 여러 학생에게 동일하거나 지나치게 유사한 문장을 반복하지 마세요. 같은 성취수준의 학생이라도 관찰 특성이 다르면 문장의 구성과 표현을 달리하세요.

6. 같은 학생의 기록 안에서도 동일하거나 유사한 내용을 불필요하게 반복하지 마세요.

7. 지나치게 어렵거나 과장된 표현을 사용하지 말고 교사가 실제 학교생활기록부에 기록할 수 있는 자연스러운 문체를 사용하세요.

8. 가능한 경우 외국어 표현 대신 자연스러운 우리말 표현을 사용하세요.

9. 문장의 종결은 '~함.', '~됨.', '~임.', '~음.' 등의 명사형으로 작성하세요.

10. 문장을 지나치게 짧게 나열하지 말고 관련된 내용을 쉼표와 적절한 연결 표현을 활용하여 자연스럽게 연결하세요.

11. 하나의 문장에서 동일한 연결 표현을 반복해서 사용하지 마세요. 예를 들어 '~고 ~고', '~하며 ~하며', '~며 ~며'와 같은 반복을 피하세요.

12. '이해함.', '느낌.', '알게 됨.'처럼 학생의 내면 상태만을 단독으로 서술하는 표현을 피하세요.

13. 가능한 경우 교사가 관찰할 수 있는 행동을 중심으로 작성하세요. 예를 들어 작성함, 표현함, 설명함, 발표함, 주장함, 적용함, 해결함 등의 표현을 맥락에 맞게 사용할 수 있습니다. 단, 실제로 제공되지 않은 행동을 새롭게 만들어서는 안 됩니다.

14. 학생이 직접 자신을 평가하여 작성한 것처럼 보이는 문체를 피하고 교사의 관찰과 평가를 바탕으로 기록한 문체를 사용하세요.

15. '반장', '부반장'이라는 표현이 필요한 경우 각각 '회장', '부회장'으로 표현하세요.

16. '정보 도우미'처럼 임의의 역할명을 만들어 사용하지 마세요. 실제 행동이 제공된 경우 역할명 대신 구체적인 행동 자체를 서술하세요.

17. 의미 없는 띄어쓰기, 불필요한 줄바꿈, 불필요한 특수문자를 사용하지 마세요.


[자체 점검]

각 학생의 초안을 작성한 뒤 결과를 사용자에게 보여주기 전에 다음 내용을 스스로 점검하세요.

- 제공되지 않은 사실을 추가하지 않았는가?
- 실제 관찰 내용과 성취수준을 적절하게 반영했는가?
- 다른 학생의 특징이 섞이지 않았는가?
- 학생 간 문장이 지나치게 유사하지 않은가?
- 같은 의미를 반복하지 않았는가?
- 문장의 종결이 명사형으로 작성되었는가?
- 학생의 내면 상태를 임의로 추측하지 않았는가?
- 동일한 연결 표현을 반복하지 않았는가?
- 지나치게 과장되거나 어려운 표현이 없는가?
- 목표 바이트에 가능한 한 근접했는가?

문제가 있다면 스스로 수정하고 최종본만 제시하세요.


[출력 형식]

학생별로 다음 형식으로 구분하여 출력하세요.

학생 식별 정보가 제공된 경우 해당 학번 또는 이름을 그대로 표시하고, 제공되지 않은 경우 '학생 1', '학생 2'와 같이 표시하세요.

[학생 식별 정보]
성취수준: (입력된 성취수준)
교과 세부능력 및 특기사항:
(완성된 문장)

예상 NEIS 바이트:
(위의 바이트 계산 기준에 따라 계산한 예상 바이트 수)

각 학생의 결과를 명확하게 구분하여 출력하세요.

AI가 계산한 바이트 수는 실제 NEIS 계산 결과와 차이가 있을 수 있으므로 문장 내용과 사실성을 우선하세요.

마지막으로 다음 문장을 한 번만 출력하세요.

※ 생성된 문장은 초안입니다. 실제 수업 및 평가 과정에서 관찰한 사실과 일치하는지 교사가 최종 확인한 후 사용하세요.`

    setGeneratedPrompt(prompt)

    setTimeout(() => {
      document
        .getElementById('prompt-result')
        ?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const copyPrompt = async () => {
    if (!generatedPrompt) return

    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      setError(
        '자동 복사에 실패했습니다. 프롬프트를 직접 선택하여 복사해 주세요.'
      )
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <button className="back-button" onClick={onBack}>
            ← 홈으로
          </button>

          <div className="logo">생기부 프롬프트 도우미</div>

          <div className="header-space"></div>
        </div>
      </header>

      <main className="form-main">
        <section className="page-heading">
          <p className="hero-label">교과 세부능력 및 특기사항</p>

          <h1>교과 세특 프롬프트 만들기</h1>

          <p>
            필요한 정보를 입력하면 ChatGPT, Gemini 등에서 바로 사용할 수
            있는 프롬프트를 만들어 드립니다.
          </p>
        </section>

        <section className="form-card">
          <div className="form-section-heading">
            <span>1</span>

            <div>
              <h2>기본 정보</h2>
              <p>* 표시된 항목은 필수 입력입니다.</p>
            </div>
          </div>

          <div className="three-column">
            <label>
              학교급 *
              <select
                value={schoolLevel}
                onChange={(e) => setSchoolLevel(e.target.value)}
              >
                <option>중학교</option>
                <option>고등학교</option>
              </select>
            </label>

            <label>
              학년 *
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option>1학년</option>
                <option>2학년</option>
                <option>3학년</option>
              </select>
            </label>

            <label>
              교과명 *
              <input
                type="text"
                placeholder="예: 정보"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="form-card">
          <div className="form-section-heading">
            <span>2</span>

            <div>
              <h2>작성 분량</h2>
              <p>NEIS 바이트 기준으로 목표 분량을 설정합니다.</p>
            </div>
          </div>

          <div className="byte-input-row">
            <input
              type="number"
              min="1"
              max="1500"
              value={targetBytes}
              onChange={(e) => setTargetBytes(e.target.value)}
            />

            <strong>/ 1500 Bytes</strong>
          </div>

          <div className="quick-buttons">
            {[500, 750, 1000, 1250, 1500].map((byte) => (
              <button
                key={byte}
                type="button"
                className={Number(targetBytes) === byte ? 'active' : ''}
                onClick={() => setTargetBytes(byte)}
              >
                {byte}B
              </button>
            ))}
          </div>

          <div className="byte-guide">
            한글 3B · 영문/숫자/특수문자/띄어쓰기 1B · 줄바꿈 2B
          </div>
        </section>

        <section className="form-card">
          <div className="form-section-heading">
            <span>3</span>

            <div>
              <h2>작성 기준</h2>
              <p>선택 사항입니다. 필요한 경우에만 입력하세요.</p>
            </div>
          </div>

          <label>
            최상위 성취수준의 기대 수행 특성
            <textarea
              rows="5"
              placeholder="예: 다양한 문제 상황을 분석하여 적절한 해결 절차를 설계하고 이를 적용하여 문제를 해결할 수 있음."
              value={topPerformance}
              onChange={(e) => setTopPerformance(e.target.value)}
            />
          </label>

          <label>
            특히 강조하고 싶은 내용
            <textarea
              rows="4"
              placeholder="예: 문제 해결 과정과 학생별 개별적인 특징이 잘 드러나도록 작성"
              value={emphasis}
              onChange={(e) => setEmphasis(e.target.value)}
            />
          </label>
        </section>

        <section className="form-card">
          <div className="form-section-heading">
            <span>4</span>

            <div>
              <h2>학생 정보</h2>
              <p>학생별 성취수준과 실제 관찰 내용을 입력하세요.</p>
            </div>
          </div>

          <div className="identity-box">
            <strong>학생 식별 정보</strong>

            <p className="identity-description">
              학번과 이름을 프롬프트에 포함할지 선택할 수 있습니다.
            </p>

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="identity"
                  checked={identityType === 'none'}
                  onChange={() => setIdentityType('none')}
                />
                사용하지 않음
              </label>

              <label>
                <input
                  type="radio"
                  name="identity"
                  checked={identityType === 'number'}
                  onChange={() => setIdentityType('number')}
                />
                학번 사용
              </label>

              <label>
                <input
                  type="radio"
                  name="identity"
                  checked={identityType === 'name'}
                  onChange={() => setIdentityType('name')}
                />
                학번 + 이름 사용
              </label>
            </div>
          </div>

          <div className="students">
            {students.map((student, index) => (
              <div className="student-card" key={student.id}>
                <div className="student-card-header">
                  <h3>학생 {index + 1}</h3>

                  {students.length > 1 && (
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeStudent(student.id)}
                    >
                      삭제
                    </button>
                  )}
                </div>

                <div className="student-fields">
                  {identityType !== 'none' && (
                    <label>
                      학번
                      <input
                        type="text"
                        placeholder="예: 10101"
                        value={student.number}
                        onChange={(e) =>
                          updateStudent(
                            student.id,
                            'number',
                            e.target.value
                          )
                        }
                      />
                    </label>
                  )}

                  {identityType === 'name' && (
                    <label>
                      이름
                      <input
                        type="text"
                        placeholder="학생 이름"
                        value={student.name}
                        onChange={(e) =>
                          updateStudent(
                            student.id,
                            'name',
                            e.target.value
                          )
                        }
                      />
                    </label>
                  )}

                  <label>
                    성취수준 *
                    <input
                      type="text"
                      placeholder="예: A 또는 1등급"
                      value={student.level}
                      onChange={(e) =>
                        updateStudent(
                          student.id,
                          'level',
                          e.target.value
                        )
                      }
                    />
                  </label>
                </div>

                <label>
                  학생의 실제 관찰 특성
                  <textarea
                    rows="4"
                    placeholder="예: 오류가 발생하면 원인을 찾아 코드를 수정하며 조건문을 정확하게 활용함."
                    value={student.observation}
                    onChange={(e) =>
                      updateStudent(
                        student.id,
                        'observation',
                        e.target.value
                      )
                    }
                  />
                </label>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="add-student-button"
            onClick={addStudent}
          >
            + 학생 추가
          </button>

          <div className="excel-coming-soon">
            <strong>📊 엑셀·스프레드시트 일괄 입력</strong>
            <span>추후 지원 예정</span>
          </div>
        </section>

        {error && <div className="error-message">{error}</div>}

        <button
          type="button"
          className="generate-button"
          onClick={generatePrompt}
        >
          프롬프트 만들기
        </button>

        {generatedPrompt && (
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
                onClick={copyPrompt}
              >
                {copied ? '✓ 복사됨' : '📋 프롬프트 복사'}
              </button>
            </div>

            <textarea
              className="prompt-output"
              value={generatedPrompt}
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
        )}
      </main>
    </div>
  )
}

export default App