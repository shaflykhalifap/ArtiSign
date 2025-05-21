interface MessageProps {
  text: string;
}

const Chatbox: React.FC = () => {
  return (
    <div className="flex flex-col-reverse gap-6 px-4 py-4 h-full overflow-y-auto">
      <BotBubble text="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium..." />
      <UserBubble text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt." />
    </div>
  );
};

const UserBubble: React.FC<MessageProps> = ({ text }) => {
  return (
    <div className="self-end bg-transparent border border-blue-500 text-white rounded-lg rounded-br-none px-4 py-2 max-w-md">
      <p>{text}</p>
    </div>
  );
};

const BotBubble: React.FC<MessageProps> = ({ text }) => {
  return (
    <div className="self-start bg-blue-600 text-white rounded-lg rounded-bl-none px-4 py-2 max-w-md">
      <p>{text}</p>
    </div>
  );
};

export default Chatbox;
