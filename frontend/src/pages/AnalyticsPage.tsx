import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Типы данных для запроса и ответа
interface AverageGradeRequest {
  start_date: string;
  end_date: string;
  filter_by: string;
}

interface AverageGradeResponse {
  entity: string;
  average_grade: number;
}

const AnalyticsPage = () => {
  // Стейт для хранения данных формы
  const [startDate, setStartDate] = useState<string>("2020-12-12");
  const [endDate, setEndDate] = useState<string>("2025-12-12");
  const [filterBy, setFilterBy] = useState<string>("teachers");

  // Стейт для хранения результата запроса
  const [grades, setGrades] = useState<AverageGradeResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Функция для обработки отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Сбросить ошибку перед новым запросом

    // Структура запроса
    const requestData: AverageGradeRequest = {
      start_date: startDate,
      end_date: endDate,
      filter_by: filterBy,
    };

    try {
      // Отправка запроса
      const response = await axios.post<AverageGradeResponse[]>(
        "http://localhost:8000/average_grade/calculate-average-grade",
        requestData
      );

      // Обновление стейта с результатами
      setGrades(response.data);
    } catch (err) {
      // Обработка ошибок
      setError("Error: Unable to fetch average grades");
    }
  };

  // Генерация данных для графика
  const chartData = {
    labels: grades.map((grade) => grade.entity), // Имена сущностей
    datasets: [
      {
        label: "Average Grade",
        data: grades.map((grade) => grade.average_grade), // Средние оценки
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Функция для сохранения PDF
  const saveAsPDF = async () => {
    try {
      const pdf = new jsPDF("portrait", "mm", "a4");

      // Получение DOM-элемента графика
      const chartElement = document.getElementById("chart-container");
      if (chartElement) {
        const canvas = await html2canvas(chartElement);
        const chartImage = canvas.toDataURL("image/png");

        // Добавление графика в PDF
        pdf.addImage(chartImage, "PNG", 10, 10, 190, 80);
      }

      // Добавление текста в PDF
      pdf.text("Average Grades", 10, 100);
      grades.forEach((grade, index) => {
        pdf.text(
          `${grade.entity}: ${grade.average_grade.toFixed(2)}`,
          10,
          110 + index * 10
        );
      });

      // Сохранение файла
      pdf.save("average_grades.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div>
      <h1>Calculate Average Grade</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Filter By:
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="students">Students</option>
              <option value="teachers">Teachers</option>
              <option value="groups">Groups</option>
              <option value="years">Years</option>
              <option value="subjects">Subjects</option>
            </select>
          </label>
        </div>
        <button type="submit">Calculate</button>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div>
        <h2>Average Grades:</h2>
        {grades.length > 0 ? (
          <>
            <ul>
              {grades.map((grade, index) => (
                <li key={index}>
                  <strong>{grade.entity}</strong>:{" "}
                  {grade.average_grade.toFixed(2)}
                </li>
              ))}
            </ul>
            <div id="chart-container">
              <Bar data={chartData} options={{ responsive: true }} />
            </div>
            <button onClick={saveAsPDF}>Save as PDF</button>
          </>
        ) : (
          <p>No results to display.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
