import * as companyRepository from "../repositories/companyRepository.js"
import * as employeeRepository from "../repositories/employeeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"
import * as cardUtils from "../utils/cardUtils.js"
import bcrypt from "bcrypt"


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
  const cardName = cardUtils.formatCardName(employee.fullName)


  const card = cardUtils.formatCardData(employeeId, cardName, type)

  await cardRepository.insert(card);
}

export async function activateCard(cardId: number, securityCode: string, password:string) {

  const card = await cardRepository.findById(cardId)
  if(!card){
    throw {type: "not_found", message: "Card not Found"}
  }

  if(card.password){
    throw {type: "conflict", message: "Card already activated "}
  }

  cardUtils.checkExpirationDate(card.expirationDate)

  if(!bcrypt.compareSync(card.securityCode, securityCode)){
    throw {type: "forbidden", message: "Security code does not match"}
  }

  const hashPassword = bcrypt.hashSync(password, 10)

  await cardRepository.update(cardId, {password:hashPassword, isBlocked: false})
}