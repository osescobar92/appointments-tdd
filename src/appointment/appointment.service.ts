import { Injectable } from '@nestjs/common';
import { Appointment } from './appointment.model';
import { PatientService } from '../patient/patient.service'

export interface AppointmentInput {
    patientId: number;
    startTime: Date;
    endTime: Date;
}

@Injectable()
export class AppointmentService {

    constructor(private readonly patientService: PatientService) {}
    
    public async scheduleAppointment(appointmentData: AppointmentInput): Promise<Appointment> {
        if(appointmentData.endTime <= appointmentData.startTime) {
            throw new Error("appointment's endTime should be after startTime");
        }
        
        if (this.endTimeIsInTheNextDay(appointmentData)) {
            throw new Error(
              "appointment's endTime should be in the same day as start time's",
            );
        }

        const patientExists = 
            await this.patientService.doesPatientExists(appointmentData.patientId);

        if(!patientExists) {
            throw new Error('Patient does not exists.');
        }

        return {
            ...appointmentData,
            confirmed: false
        }
    }

    private endTimeIsInTheNextDay(appointmentData: AppointmentInput): boolean {
        const differentDays = 
            appointmentData.endTime.getUTCDate() !==
            appointmentData.startTime.getUTCDate();

        const differentMonths = 
            appointmentData.endTime.getUTCMonth() !==
            appointmentData.startTime.getUTCMonth();

        // Now we also check for years
        const differentYears =
        appointmentData.endTime.getUTCFullYear() !==
        appointmentData.startTime.getUTCFullYear();

        return differentDays || differentMonths || differentYears;
    }
}
