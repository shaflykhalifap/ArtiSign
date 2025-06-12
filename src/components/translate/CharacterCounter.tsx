interface CharacterCounterProps {
  currentLength: number;
  maxLength: number;
}

const CharacterCounter = ({
  currentLength,
  maxLength,
}: CharacterCounterProps) => {
  return (
    <div className="p-2 text-right text-sm text-gray-400">
      {currentLength} / {maxLength}
    </div>
  );
};

export default CharacterCounter;
