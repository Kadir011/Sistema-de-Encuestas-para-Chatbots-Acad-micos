import Header from '../components/layout/Header';
import StudentSurveyForm from '../components/surveys/StudentSurveyForm';

const StudentSurvey = () => {
    return (
        <div>
            <Header 
                title="Encuesta para Estudiantes"
                subtitle="Completa esta encuesta para compartir tu experiencia con chatbots de IA"
            />
            <StudentSurveyForm />
        </div>
    );
};

export default StudentSurvey;