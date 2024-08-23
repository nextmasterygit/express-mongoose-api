import { Response } from "express";
export const Result = (
  res: Response,
  code: number,
  message: string,
  data?: [],
  total?: number,
  custom?: {}
) => {
  // Construct the Record object
  let Record: Record<string, any> = {};
  let status = code < 300 ? "SUCCESS" : "ERROR";

  // Add tableData to the Record object if it's provided
  if (data !== undefined) {
    Record.data = data;
    //   Record.tableData = data;
  }

  // Add total to the Record object if it's provided
  if (total !== undefined) {
    Record.total = total;
  }

  // Return the response
  return res.status(code).json({ ...Record, ...custom, status, message });
  //   return res.status(code).json({ Record,status,message});
};