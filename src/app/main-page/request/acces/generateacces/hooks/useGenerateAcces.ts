import useQuery from "@/app/hooks/useQuery/useQuery";
const useGenerateAcces = () => {
    const { all } = useQuery();
    const idAcces = all?.idAcces;
    const mode = all?.mode;
    return { idAcces,mode };
}
export default useGenerateAcces;