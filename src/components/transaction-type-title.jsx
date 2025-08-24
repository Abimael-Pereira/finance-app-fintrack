const TransactionTypeIcon = ({ icon, title, percentage }) => {
  return (
    <div className="flex items-center justify-between gap-10">
      <div className="flex items-center gap-2">
        <img
          src={icon}
          alt={title}
          className="rounded-md bg-white bg-opacity-5 p-2"
        />
        <span className="text-[#71717A] opacity-80">{title}</span>
      </div>
      {percentage && <div>{percentage}%</div>}
    </div>
  );
};

export default TransactionTypeIcon;
