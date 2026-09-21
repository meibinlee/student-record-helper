function FormSectionHeading({
  number,
  title,
  description,
}) {
  return (
    <div className="form-section-heading">
      <span>{number}</span>

      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  )
}

export default FormSectionHeading