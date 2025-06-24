import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor() { }

    setInvoiceNumber(data) {
        let invoiceNumber = "";
        if (data && data.AppReference) {
            invoiceNumber = "INV-" + (data.AppReference.split("-")[1]);
        }
        return invoiceNumber;
    }

    setFareBreakup(response) {
        let totalPassengerCount = response.FlightBookingTransaction[0].flightBookingTransactionPassengers.length;
        let ait = response.TotalFarePriceBreakUp.PriceBreakup.AdvanceTax;
        let adultRecord = response.FlightBookingTransaction[0].flightBookingTransactionPassengers.filter((ele) => ele.passenger_type.toLowerCase() === "adult");
        if (adultRecord && adultRecord.length > 0) {
            this.setAdultFare(adultRecord, response, totalPassengerCount, ait);
        }

        let childRecord = response.FlightBookingTransaction[0].flightBookingTransactionPassengers.filter((ele) => ele.passenger_type.toLowerCase() === "child");
        if (childRecord && childRecord.length > 0) {
            this.setChildFare(childRecord, response, totalPassengerCount, ait);
        }

        let infantRecord = response.FlightBookingTransaction[0].flightBookingTransactionPassengers.filter((ele) => ele.passenger_type.toLowerCase() === "infant");
        if (infantRecord && infantRecord.length > 0) {
            this.setInfantFare(infantRecord, response, totalPassengerCount, ait);
        }
    }

    setAdultFare(adultRecord,response,totalPassengerCount,ait){
        let adultPriceBreakUp=response.TotalFarePriceBreakUp.PassengerBreakup.ADT;
           if(adultPriceBreakUp){
            adultRecord.forEach(adult => {
                adult.gross_Tax=adultPriceBreakUp.TotalPrice;
                adult.fareBDT=adultPriceBreakUp.BasePrice;
                adult.discount=response.TotalFarePriceBreakUp.PriceBreakup.CommissionDetails.AgentCommission/totalPassengerCount;
                adult.taxBDT=adultPriceBreakUp.Tax;
                adult.netFare=(adultPriceBreakUp.TotalPrice)-adult.discount+(ait/totalPassengerCount);
            });
           }
    }

    setChildFare(childRecord,response,totalPassengerCount,ait){
        let childPriceBreakUp=response.TotalFarePriceBreakUp.PassengerBreakup.CHD;
        if(childPriceBreakUp){
            childRecord.forEach(child => {
                child.gross_Tax=childPriceBreakUp.TotalPrice;
                child.fareBDT=childPriceBreakUp.BasePrice;
                child.discount=response.TotalFarePriceBreakUp.PriceBreakup.CommissionDetails.AgentCommission/totalPassengerCount;
                child.taxBDT=childPriceBreakUp.Tax;
                child.netFare=(childPriceBreakUp.TotalPrice)-child.discount+(ait/totalPassengerCount);
            });
        }
    }

    setInfantFare(infantRecord,response,totalPassengerCount,ait){
        let infantPriceBreakUp=response.TotalFarePriceBreakUp.PassengerBreakup.INF;
        if(infantPriceBreakUp)
        {
            infantRecord.forEach(infant => {
            infant.gross_Tax=infantPriceBreakUp.TotalPrice;
            infant.fareBDT=infantPriceBreakUp.BasePrice;
            infant.discount=response.TotalFarePriceBreakUp.PriceBreakup.CommissionDetails.AgentCommission/totalPassengerCount;
            infant.taxBDT=infantPriceBreakUp.Tax;
            infant.netFare=(infantPriceBreakUp.TotalPrice)-infant.discount+(ait/totalPassengerCount);
        });
    }
    }

    copy(appReference){
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = appReference;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    getLeaduserDetails(data) {
        if (data) {
          let leadUser = data.filter(x => {
            return x.LeadPax == true
          });
          return leadUser[0];
        }
      }
}
