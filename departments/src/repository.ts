export type Department = {
  id: number;
  name: string;
  employeeIds: number[];
};

export const departments: Department[] = [
  {
    id: 1,
    name: "Finance",
    employeeIds: [1, 2, 3],
  },
  {
    id: 2,
    name: "Happiness",
    employeeIds: [6, 7, 8],
  },
];
