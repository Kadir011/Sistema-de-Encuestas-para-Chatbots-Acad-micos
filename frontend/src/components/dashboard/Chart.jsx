import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Chart = ({ 
    type = 'bar', 
    data, 
    options = {}, 
    title,
    height = 300,
    className = '' 
}) => {
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: !!title,
                text: title,
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
        },
        ...options,
    };

    const chartComponents = {
        line: Line,
        bar: Bar,
        pie: Pie,
        doughnut: Doughnut,
    };

    const ChartComponent = chartComponents[type] || Bar;

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <div style={{ height }}>
                <ChartComponent data={data} options={defaultOptions} />
            </div>
        </div>
    );
};

export default Chart;