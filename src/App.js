import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, getDocs } from "firebase/firestore";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'tailwindcss/tailwind.css'; 

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    async function fetchExams() {
      try {
        const q = query(collection(db, "users", "1a8e13nhVnOPO3rOOwL8", "exams"));
        const querySnapshot = await getDocs(q);
        const examsList = querySnapshot.docs.map(doc => doc.data());
        setExams(examsList);
        setFilteredExams(examsList);
      } catch (error) {
        console.error("Erro ao buscar exames:", error);
      }
    }

    fetchExams();
  }, []);

  const handleTypeChange = (type) => {
    setSelectedType(type);

    if (type === 'all') {
      setFilteredExams(exams);
    } else {
      const filtered = exams.filter(exam => exam.type === type);
      setFilteredExams(filtered);
    }
  };

  const examTypes = [...new Set(exams.map(exam => exam.type))];
  const examNames = [...new Set(filteredExams.map(exam => exam.name))];

  const examsByDate = filteredExams.reduce((acc, exam) => {
    if (!acc[exam.date]) {
      acc[exam.date] = {};
    }
    acc[exam.date][exam.name] = exam.value;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(examsByDate),
    datasets: examNames.map((name, index) => ({
      label: name,
      data: Object.keys(examsByDate).map(date => examsByDate[date][name] || null),
      borderColor: `rgba(${index * 30}, 99, 132, 1)`,
      backgroundColor: `rgba(${index * 30}, 99, 132, 0.2)`,
      fill: false,
    })),
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen p-6 transition-all`}>
      
      {/* Toggle Dark Mode */}
      <button
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg focus:outline-none"
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold">Gráfico de Exames</h1>
      </header>

      {/* Filtro por tipo de exame */}
      <div className="mb-6 flex justify-center">
        <label htmlFor="type-filter" className="mr-4 text-lg font-medium">
          Filtrar por Tipo:
        </label>
        <select
          id="type-filter"
          value={selectedType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="bg-white border border-gray-300 py-2 px-4 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="all">Todos</option>
          {examTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Gráfico */}
      <div className="bg-white p-4 rounded-lg shadow-lg dark:bg-gray-800">
        {filteredExams.length > 0 ? (
          <Line
            data={data}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `${context.dataset.label}: ${context.raw}`;
                    },
                  },
                },
              },
            }}
          />
        ) : (
          <div className="flex justify-center items-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24"></svg>
            <p className="text-gray-500">Carregando exames...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
