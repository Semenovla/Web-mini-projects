const TextContainer = ({ text }) => {
  return (
    <div>
      <ol>
        {text.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    </div>
  );
};

export default TextContainer;
