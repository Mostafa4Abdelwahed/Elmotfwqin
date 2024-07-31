import Header from "../../../Components/ui/Header"
import LessonCard from "../../../Components/Profile/LessonCard";
import Container from "../../../Components/ui/container"
import { useGetAllLessonsQuery } from "../../../app/ApiCalls/lessonSlice";
import { useParams } from "react-router-dom";
import LessonsSkeleton from "../../../Components/Skeletons/LessonsSkeleton";

const Lessons = () => {
  const params =  useParams();
  const { data: lessons, isLoading, isError } = useGetAllLessonsQuery(params.unity);
  if (isLoading) {
    return <LessonsSkeleton />;
  }
  return (    
    <Container>
      <Header title="الدروس" desc="قم بإختيار الدرس لعرض تفاصيلة" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-10">
        {
          lessons?.data?.map((lesson, key) =>{
            return <LessonCard key={key} lesson={lesson} />
          })
        }
      </div>
    </Container>
  );
};

export default Lessons;
