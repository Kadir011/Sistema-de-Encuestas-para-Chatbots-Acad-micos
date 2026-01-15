import Header from '../components/layout/Header';
import TeacherSurveyForm from '../components/surveys/TeacherSurveyForm';

const TeacherSurvey = () => {
    return (
        <div>
            <Header 
                title="Encuesta para Profesores"
                subtitle="Completa esta encuesta para compartir tu experiencia usando chatbots en la enseñanza"
            />
            <TeacherSurveyForm />
        </div>
    );
};

export default TeacherSurvey;