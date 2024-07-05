import { Department, departments } from "./repository.js";

const resolvers = {
  Query: {
    departments: () => departments,
    department: (_: any, { id }: { id: string }) =>
      departments.find((d) => d.id === +id),
  },
  Department: {
    __resolveReference: (department: Department) => {
      console.log("Department.__resolveReference", department);
      return departments.find((d) => d.id === +department.id);
    },
    employees: (department: Department) => {
      return department.employeeIds.map((id) => ({ id }));
    },
  },
};

export { resolvers };
