import useComments from "./hooks/useComments";
import CommentCard from "./components/commentCard/commentCard";
import { formatDateHour } from "@/app/utilities/DatesHelper/Dateshelper";
interface CommentItem {
  Comment: string;
  userName: string;
  Title?: string;
  DateTime: string;
}

const parseComments = (value: unknown): CommentItem[] => {
  try {
    if (!value) return [];

    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    }

    return [];
  } catch (error) {
    console.error("Error parsing comments:", error);
    return [];
  }
};

const Comments = () => {
  const { current } = useComments();

  const internalComments = parseComments(current?.internal_comments);
  const externalComments = parseComments(current?.external_comments);

  return (
    <div >
      {internalComments.map((c, index) => (
        <CommentCard
          key={`internal-${index}`}
          title={c.Title ?? "Comentario interno"}
          date={formatDateHour(c.DateTime)}
          comment={c.Comment}
          commentName={c.userName}
        />
      ))}

      {externalComments.map((c, index) => (
        <CommentCard
          key={`external-${index}`}
          title={c.Title ?? "Comentario externo"}
          date={formatDateHour(c.DateTime)}
          comment={c.Comment}
          commentName={c.userName}
        />
      ))}
    </div>
  );
};

export default Comments;
