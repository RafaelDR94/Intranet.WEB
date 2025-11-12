import useQuery from "@/app/hooks/useQuery/useQuery";
const useGenerateAcces = () => {
    const { all } = useQuery();
    const idAcces = all?.idAcces;
    return { idAcces };
}
export default useGenerateAcces;