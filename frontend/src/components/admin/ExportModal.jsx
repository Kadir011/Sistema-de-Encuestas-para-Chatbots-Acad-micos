import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Alert from '../common/Alert';
import { Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import exportService from '../../services/exportService';

const ExportModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        type: 'student',
        startDate: '',
        endDate: '',
        hasExperience: 'all',
        country: '',
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const exportToExcel = (data, filename) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Encuestas');
        
        // Ajustar ancho de columnas
        const maxWidth = 50;
        const colWidths = Object.keys(data[0] || {}).map(key => ({
            wch: Math.min(
                Math.max(
                    key.length,
                    ...data.map(row => String(row[key] || '').length)
                ),
                maxWidth
            )
        }));
        worksheet['!cols'] = colWidths;
        
        XLSX.writeFile(workbook, filename);
    };

    const handleExportSurveys = async () => {
        try {
            setLoading(true);
            setError('');
            
            const queryParams = new URLSearchParams();
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);
            if (filters.hasExperience !== 'all') {
                queryParams.append('hasExperience', filters.hasExperience);
            }
            if (filters.country) queryParams.append('country', filters.country);
            
            let response;
            if (filters.type === 'student') {
                response = await exportService.exportStudentSurveys(queryParams.toString());
            } else {
                response = await exportService.exportTeacherSurveys(queryParams.toString());
            }
            
            if (response.data && response.data.length > 0) {
                const timestamp = new Date().toISOString().split('T')[0];
                const filename = `encuestas_${filters.type}_${timestamp}.xlsx`;
                exportToExcel(response.data, filename);
                
                onClose();
            } else {
                setError('No hay datos para exportar con los filtros seleccionados');
            }
        } catch (err) {
            setError('Error al exportar datos: ' + (err.message || 'Error desconocido'));
        } finally {
            setLoading(false);
        }
    };

    const handleExportStatistics = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await exportService.exportStatistics(filters.type);
            
            if (response.statistics) {
                const workbook = XLSX.utils.book_new();
                
                // Hoja de estadísticas generales
                if (filters.type === 'student' && response.statistics.student) {
                    const stats = response.statistics.student;
                    
                    // Estadísticas generales
                    const generalData = [
                        { Métrica: 'Total de Encuestas', Valor: stats.general.total_surveys || 0 },
                        { Métrica: 'Promedio Utilidad', Valor: stats.general.avg_usefulness || 0 },
                        { Métrica: 'Promedio Experiencia', Valor: stats.general.avg_experience || 0 },
                        { Métrica: 'Usuarios con Chatbot', Valor: stats.general.users_with_chatbot || 0 },
                        { Métrica: 'Continuarán Usando', Valor: stats.general.will_continue || 0 },
                        { Métrica: 'Recomendarían', Valor: stats.general.would_recommend || 0 },
                    ];
                    const wsGeneral = XLSX.utils.json_to_sheet(generalData);
                    XLSX.utils.book_append_sheet(workbook, wsGeneral, 'Estadísticas Generales');
                    
                    // Chatbots más usados
                    if (stats.chatbots && stats.chatbots.length > 0) {
                        const chatbotData = stats.chatbots.map(c => ({
                            Chatbot: c.chatbot,
                            'Cantidad de Usos': c.count
                        }));
                        const wsChatbots = XLSX.utils.json_to_sheet(chatbotData);
                        XLSX.utils.book_append_sheet(workbook, wsChatbots, 'Chatbots');
                    }
                    
                    // Tareas más comunes
                    if (stats.tasks && stats.tasks.length > 0) {
                        const taskData = stats.tasks.map(t => ({
                            Tarea: t.task,
                            'Cantidad de Usos': t.count
                        }));
                        const wsTasks = XLSX.utils.json_to_sheet(taskData);
                        XLSX.utils.book_append_sheet(workbook, wsTasks, 'Tareas');
                    }
                    
                    // Distribución de frecuencia
                    if (stats.frequency && stats.frequency.length > 0) {
                        const freqData = stats.frequency.map(f => ({
                            Frecuencia: f.usage_frequency,
                            Cantidad: f.count
                        }));
                        const wsFreq = XLSX.utils.json_to_sheet(freqData);
                        XLSX.utils.book_append_sheet(workbook, wsFreq, 'Frecuencia de Uso');
                    }
                } else if (filters.type === 'teacher' && response.statistics.teacher) {
                    const stats = response.statistics.teacher;
                    
                    // Estadísticas generales
                    const generalData = [
                        { Métrica: 'Total de Encuestas', Valor: stats.general.total_surveys || 0 },
                        { Métrica: 'Profesores Usando Chatbots', Valor: stats.general.teachers_using_chatbots || 0 },
                        { Métrica: 'Muy Probable Continuar', Valor: stats.general.very_likely_continue || 0 },
                        { Métrica: 'Probable Continuar', Valor: stats.general.likely_continue || 0 },
                    ];
                    const wsGeneral = XLSX.utils.json_to_sheet(generalData);
                    XLSX.utils.book_append_sheet(workbook, wsGeneral, 'Estadísticas Generales');
                    
                    // Distribución por país
                    if (stats.countries && stats.countries.length > 0) {
                        const countryData = stats.countries.map(c => ({
                            País: c.country,
                            Cantidad: c.count
                        }));
                        const wsCountries = XLSX.utils.json_to_sheet(countryData);
                        XLSX.utils.book_append_sheet(workbook, wsCountries, 'Países');
                    }
                    
                    // Propósitos más comunes
                    if (stats.purposes && stats.purposes.length > 0) {
                        const purposeData = stats.purposes.map(p => ({
                            Propósito: p.purpose,
                            Cantidad: p.count
                        }));
                        const wsPurposes = XLSX.utils.json_to_sheet(purposeData);
                        XLSX.utils.book_append_sheet(workbook, wsPurposes, 'Propósitos');
                    }
                    
                    // Desafíos más comunes
                    if (stats.challenges && stats.challenges.length > 0) {
                        const challengeData = stats.challenges.map(ch => ({
                            Desafío: ch.challenge,
                            Cantidad: ch.count
                        }));
                        const wsChallenges = XLSX.utils.json_to_sheet(challengeData);
                        XLSX.utils.book_append_sheet(workbook, wsChallenges, 'Desafíos');
                    }
                }
                
                const timestamp = new Date().toISOString().split('T')[0];
                const filename = `estadisticas_${filters.type}_${timestamp}.xlsx`;
                XLSX.writeFile(workbook, filename);
                
                onClose();
            } else {
                setError('No hay estadísticas disponibles');
            }
        } catch (err) {
            setError('Error al exportar estadísticas: ' + (err.message || 'Error desconocido'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Exportar Datos a Excel"
            size="md"
        >
            <div className="space-y-6">
                {error && (
                    <Alert type="error" message={error} onClose={() => setError('')} />
                )}

                {/* Filtros */}
                <div className="space-y-4">
                    <Select
                        label="Tipo de Encuesta"
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        options={[
                            { value: 'student', label: 'Encuestas de Estudiantes' },
                            { value: 'teacher', label: 'Encuestas de Profesores' },
                        ]}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Fecha Desde"
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                        />

                        <Input
                            label="Fecha Hasta"
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <Select
                        label="Filtrar por Experiencia"
                        name="hasExperience"
                        value={filters.hasExperience}
                        onChange={handleFilterChange}
                        options={[
                            { value: 'all', label: 'Todos' },
                            { value: 'true', label: 'Solo con experiencia' },
                            { value: 'false', label: 'Solo sin experiencia' },
                        ]}
                    />

                    {filters.type === 'teacher' && (
                        <Input
                            label="Filtrar por País"
                            name="country"
                            value={filters.country}
                            onChange={handleFilterChange}
                            placeholder="Ej: Ecuador"
                        />
                    )}
                </div>

                {/* Botones de Exportación */}
                <div className="border-t pt-4 space-y-3">
                    <p className="text-sm text-gray-600 mb-4">
                        Selecciona qué tipo de datos deseas exportar:
                    </p>
                    
                    <Button
                        onClick={handleExportSurveys}
                        loading={loading}
                        fullWidth
                        icon={<FileSpreadsheet size={20} />}
                    >
                        Exportar Encuestas Completas
                    </Button>

                    <Button
                        onClick={handleExportStatistics}
                        loading={loading}
                        fullWidth
                        variant="secondary"
                        icon={<Download size={20} />}
                    >
                        Exportar Estadísticas y Análisis
                    </Button>
                </div>

                {/* Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Nota:</strong> Las encuestas completas incluyen toda la información 
                        detallada de cada respuesta. Las estadísticas incluyen resúmenes y análisis 
                        agregados en múltiples hojas.
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default ExportModal;