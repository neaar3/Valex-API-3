import * as companyRepository from "../repositories/companyRepository.js"
import * as employeeRepository from "../repositories/employeeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"
import { formatCardName } from "../utils/cardUtils.js"
export async function createCard(employeeId: number, type: cardRepository.TransactionTypes, apiKey: string) {
  
  const existCompany = await companyRepository.findByApiKey(apiKey)
  if(!existCompany){
    throw {type: "not_found", message: "Company not found"}
  }
  const employee = await employeeRepository.findById(employeeId)
  if(!employee){
    throw {type: "not_found", message: "Employee not found"}
  }
  const employeeCard = await cardRepository.findByTypeAndEmployeeId(type, employeeId)
  if(employeeCard){
    throw {type: "conflict", message: "Employee cannot register a second card of the same type"}
  }
  const cardName = formatCardName(employee.fullName)
  
}