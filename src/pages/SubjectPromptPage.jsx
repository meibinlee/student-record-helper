import { useState } from 'react'

import Header from '../components/Header'
import SiteFooter from '../components/SiteFooter'
import FormSectionHeading from '../components/FormSectionHeading'
import PromptResult from '../components/PromptResult'
import { createSubjectPrompt } from '../prompts/subjectPrompt'

function createEmptyStudent() {
  return {
    id: Date.now() + Math.random(),
    number: '',
    name: '',
    level: '',
    observation: '',
  }
}

function getStudentIdentity(student, index, identityType) {
  if (identityType === 'number' && student.number.trim()) {
    return `학번 ${student.number.trim()}`
  }

  if (identityType === 'name') {
    const parts = []

    if (student.number.trim()) {
      parts.push(`학번 ${student.number.trim()}`)
    }

    if (student.name.trim()) {
      parts.push(`이름 ${student.name.trim()}`)
    }

    if (parts.length > 0) {
      return parts.join(' / ')
    }
  }

  return `학생 ${index + 1}`
}

function makeStudentText(students, identityType) {
  return students
    .map((student, index) => {
      const identity = getStudentIdentity(
        student,
        index,
        identityType
      )

      const observation =
        student.observation.trim() || '별도 입력 없음'

      return `[${identity}]
성취수준: ${student.level.trim()}
실제 관찰 특성: ${observation}`
    })
    .join('\n\n')
}

function SubjectPromptPage({ onBack }) {
  const [schoolLevel, setSchoolLevel] = useState('중학교')
  const [grade, setGrade] = useState('1학년')

  const [subject, setSubject] = useState('')
  const [units, setUnits] = useState('')

  const [focusContent, setFocusContent] = useState('')
  const [excludedContent, setExcludedContent] = useState('')

  const [targetBytes, setTargetBytes] = useState(1000)

  const [topPerformance, setTopPerformance] = useState('')
  const [emphasis, setEmphasis] = useState('')

  const [identityType, setIdentityType] = useState('none')

  const [students, setStudents] = useState([
    createEmptyStudent(),
  ])

  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const addStudent = () => {
    setStudents((currentStudents) => [
      ...currentStudents,
      createEmptyStudent(),
    ])
  }

  const updateStudent = (id, field, value) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === id
          ? {
              ...student,
              [field]: value,
            }
          : student
      )
    )
  }

  const removeStudent = (id) => {
    setStudents((currentStudents) => {
      if (currentStudents.length === 1) {
        return currentStudents
      }

      return currentStudents.filter(
        (student) => student.id !== id
      )
    })
  }

  const validateForm = () => {
    if (!subject.trim()) {
      return '교과명을 입력해 주세요.'
    }

    if (!units.trim()) {
      return '단원명을 입력해 주세요.'
    }

    const bytes = Number(targetBytes)

    if (!bytes || bytes < 1 || bytes > 1500) {
      return '목표 분량은 1~1500바이트 사이로 입력해 주세요.'
    }

    const emptyLevelStudent = students.find(
      (student) => !student.level.trim()
    )

    if (emptyLevelStudent) {
      return '모든 학생의 성취수준을 입력해 주세요.'
    }

    return ''
  }

  const generatePrompt = () => {
    setError('')
    setCopied(false)

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    const studentText = makeStudentText(
      students,
      identityType
    )

    const prompt = createSubjectPrompt({
      subject,
      focusContent,
      excludedContent,
      targetBytes: Number(targetBytes),
      topPerformance,
      emphasis,
      studentText,
      achievementStandards: '',
    })

    setGeneratedPrompt(prompt)

    setTimeout(() => {
      document
        .getElementById('prompt-result')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
    }, 100)
  }

  const copyPrompt = async () => {
    if (!generatedPrompt) return

    try {
      await navigator.clipboard.writeText(
        generatedPrompt
      )

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
      <Header onBack={onBack} />

      <main className="form-main">
        <section className="page-heading">
          <p className="hero-label">
            교과 세부능력 및 특기사항
          </p>

          <h1>교과 세특 프롬프트 만들기</h1>

          <p>
            수업 범위와 학생의 실제 관찰 내용을 입력하면
            AI에서 바로 사용할 수 있는 프롬프트를 만들어
            드립니다.
          </p>
        </section>

        <section className="form-card">
          <FormSectionHeading
            number="1"
            title="수업 기본 정보"
            description="* 표시된 항목은 필수 입력입니다."
          />

          <div className="basic-info-grid">
            <label>
              학교급 *
              <select
                value={schoolLevel}
                onChange={(e) =>
                  setSchoolLevel(e.target.value)
                }
              >
                <option>중학교</option>
                <option>고등학교</option>
              </select>
            </label>

            <label>
              학년 *
              <select
                value={grade}
                onChange={(e) =>
                  setGrade(e.target.value)
                }
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
                onChange={(e) =>
                  setSubject(e.target.value)
                }
              />
            </label>
          </div>

          <label className="unit-label">
            단원명 *
            <textarea
              rows="3"
              placeholder={
                '예:\n프로그래밍\n문제 해결과 알고리즘'
              }
              value={units}
              onChange={(e) =>
                setUnits(e.target.value)
              }
            />

            <small className="field-help">
              여러 단원을 작성할 수 있습니다. 쉼표로
              구분하거나 줄을 바꾸어 입력하세요.
            </small>
          </label>
        </section>

        <section className="form-card">
          <FormSectionHeading
            number="2"
            title="수업 범위"
            description="선택 사항입니다. 실제 수업에서 다룬 범위를 더 명확하게 지정할 수 있습니다."
          />

          <label>
            수업에서 중점적으로 다룬 내용
            <textarea
              rows="4"
              placeholder="예: 변수, 조건문, 반복문을 활용한 문제 해결"
              value={focusContent}
              onChange={(e) =>
                setFocusContent(e.target.value)
              }
            />

            <small className="field-help">
              단원 번호보다는 실제로 다룬 개념이나 학습
              요소를 입력해 주세요.
            </small>
          </label>

          <label>
            수업 범위에서 제외할 내용
            <textarea
              rows="4"
              placeholder="예: 함수, 리스트"
              value={excludedContent}
              onChange={(e) =>
                setExcludedContent(e.target.value)
              }
            />

            <small className="field-help">
              해당 단원에 포함될 수 있지만 이번 수업이나
              평가에서는 다루지 않은 내용을 입력하세요.
            </small>
          </label>
        </section>

        <section className="form-card">
          <FormSectionHeading
            number="3"
            title="작성 분량"
            description="NEIS 바이트 기준으로 학생 1명당 목표 분량을 설정합니다."
          />

          <div className="byte-input-row">
            <input
              type="number"
              min="1"
              max="1500"
              value={targetBytes}
              onChange={(e) =>
                setTargetBytes(e.target.value)
              }
            />

            <strong>/ 1500 Bytes</strong>
          </div>

          <div className="quick-buttons">
            {[500, 750, 1000, 1250, 1500].map(
              (byte) => (
                <button
                  key={byte}
                  type="button"
                  className={
                    Number(targetBytes) === byte
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setTargetBytes(byte)
                  }
                >
                  {byte}B
                </button>
              )
            )}
          </div>

          <div className="byte-guide">
            한글 3B · 영문/숫자/특수문자/띄어쓰기 1B ·
            줄바꿈 2B
          </div>
        </section>

        <section className="form-card">
          <FormSectionHeading
            number="4"
            title="작성 기준"
            description="선택 사항입니다. 필요한 경우에만 입력하세요."
          />

          <label>
            최상위 성취수준의 기대 수행 특성
            <textarea
              rows="5"
              placeholder="예: 다양한 문제 상황을 분석하여 적절한 해결 절차를 설계하고 이를 적용하여 문제를 해결할 수 있음."
              value={topPerformance}
              onChange={(e) =>
                setTopPerformance(e.target.value)
              }
            />
          </label>

          <label>
            기타 강조하고 싶은 작성 기준
            <textarea
              rows="4"
              placeholder="예: 학생별 문제 해결 과정의 차이가 잘 드러나도록 작성"
              value={emphasis}
              onChange={(e) =>
                setEmphasis(e.target.value)
              }
            />
          </label>
        </section>

        <section className="form-card">
          <FormSectionHeading
            number="5"
            title="학생 정보"
            description="학생별 성취수준과 실제 관찰 내용을 입력하세요."
          />

          <div className="identity-box">
            <strong>학생 식별 정보</strong>

            <p className="identity-description">
              학번과 이름을 프롬프트에 포함할지 선택할 수
              있습니다.
            </p>

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="identity"
                  checked={identityType === 'none'}
                  onChange={() =>
                    setIdentityType('none')
                  }
                />
                사용하지 않음
              </label>

              <label>
                <input
                  type="radio"
                  name="identity"
                  checked={identityType === 'number'}
                  onChange={() =>
                    setIdentityType('number')
                  }
                />
                학번 사용
              </label>

              <label>
                <input
                  type="radio"
                  name="identity"
                  checked={identityType === 'name'}
                  onChange={() =>
                    setIdentityType('name')
                  }
                />
                학번 + 이름 사용
              </label>
            </div>
          </div>

          <div className="students">
            {students.map((student, index) => (
              <div
                className="student-card"
                key={student.id}
              >
                <div className="student-card-header">
                  <h3>학생 {index + 1}</h3>

                  {students.length > 1 && (
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() =>
                        removeStudent(student.id)
                      }
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
                    placeholder="예: 조건문을 어려워하지만 필요한 부분을 질문하며 과제를 수행함."
                    value={student.observation}
                    onChange={(e) =>
                      updateStudent(
                        student.id,
                        'observation',
                        e.target.value
                      )
                    }
                  />

                  <small className="field-help">
                    메모하듯 편하게 입력해도 됩니다. 입력한
                    관찰 사실은 유지하면서 부정적인 평가
                    표현은 기록에 적합하게 정리하며, 제공되지
                    않은 긍정적인 행동은 새로 만들지 않습니다.
                  </small>
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
            <strong>
              📊 엑셀·스프레드시트 일괄 입력
            </strong>
            <span>추후 지원 예정</span>
          </div>
        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          type="button"
          className="generate-button"
          onClick={generatePrompt}
        >
          프롬프트 만들기
        </button>

        <PromptResult
          prompt={generatedPrompt}
          copied={copied}
          onCopy={copyPrompt}
        />
      </main>

      <SiteFooter />
    </div>
  )
}

export default SubjectPromptPage