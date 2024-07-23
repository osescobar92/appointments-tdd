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
        return {
            ...appointmentData,
            confirmed: false
        }
    }
}
