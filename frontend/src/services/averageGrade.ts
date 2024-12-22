// src/services/averageGrade.ts
import api from "./api";

interface AverageGradeResponse {
  data: Array<{
    entity: string; // This is the student, group, year, or teacher ID.
    average_grade: number; // The calculated average grade.
  }>;
}

export const getAverageGrade = async ({
  startDate,
  endDate,
  filterBy,
  filterValue,
}: {
  startDate: string;
  endDate: string;
  filterBy: string;
  filterValue: string;
}): Promise<AverageGradeResponse> => {
  const response = await api.post<AverageGradeResponse>(
    "/average_grade/calculate-average-grade",
    {
      start_date: startDate,
      end_date: endDate,
      filter_by: filterBy,
      filter_value: filterValue,
    }
  );
  return response.data;
};
