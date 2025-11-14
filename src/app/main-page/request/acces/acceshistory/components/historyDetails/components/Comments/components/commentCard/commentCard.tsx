import { cardStyles } from "./styles";

interface CommentCardProps {
  title?: string;
  date?: string;
  comment?: string;
  commentName?: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  title,
  date,
  comment,
  commentName,
}) => {
  return (
    <div className={cardStyles.cardContainer}>
      <div className={cardStyles.cardHead}>
        <p className={cardStyles.statusTitle}>{title}</p>
        <p className={cardStyles.date}>{date}</p>
      </div>
      <div className={cardStyles.commentContainer}>
        <p className={cardStyles.comment}>{comment}</p>
      </div>
      <div className={cardStyles.nameContainer}>
        <p className={cardStyles.name}>{commentName}</p>
      </div>
    </div>
  );
};

export default CommentCard;
