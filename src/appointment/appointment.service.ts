import { Injectable } from '@nestjs/common';
import { Appointment } from './appointment.model';

export interface AppointmentInput {
    patientId: number;
    startTime: Date;
    endTime: Date;
}

@Injectable()
export class AppointmentService {
    public scheduleAppointment(appointmentData: AppointmentInput): Appointment {
        if(appointmentData.endTime < appointmentData.startTime) {
            throw new Error("appointment's endTime should be after startTime");
        }
        
        return {
            ...appointmentData,
            confirmed: false
        }
    }
}
