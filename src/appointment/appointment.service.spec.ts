import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import { PatientModule } from '../patient/patient.module';
import { PatientService } from '../patient/patient.service';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let patientService: PatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [PatientModule],
        providers: [AppointmentService],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    patientService = module.get(PatientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should schedule an unconfirmed appointment for a user on success', async () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-01-01T15:00:00Z');
    const { id: patientId } = await patientService.register({name: 'John Doe'});

    const newAppointment = service.scheduleAppointment({
        patientId,
        startTime,
        endTime
    });

    expect(newAppointment).toEqual({
        patientId,
        startTime,
        endTime,
        confirmed: false
    })
  });

  it('should throw an error when end time is before start time', () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-01-01T13:00:00Z');

    /**
     * We have to wrap our "scheduleAppointment" function in another arrow function
     * because we expect an error to be thrown. If we don't do that,
     * Jest won't be able to properly handle the error and it will accuse that the test failed.
    */
    expect(() => {
        service.scheduleAppointment({
            patientId: 1,
            startTime,
            endTime
        });
    }).toThrowError("appointment's endTime should be after startTime")
  });

  it('should throw an error when end time is equal to start time', () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = startTime;

    expect(() => {
        service.scheduleAppointment({
            patientId: 1,
            startTime,
            endTime
        })
    })
    .toThrowError("appointment's endTime should be after startTime");
  });

  it('should throw an error when end time is in the next day', () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-01-02T00:00:00Z');

    expect(() => {
        service.scheduleAppointment({
            patientId: 1,
            startTime,
            endTime
        });
    })
    .toThrowError("appointment's endTime should be in the same day as start time's");
  });

  it('should throw an error when end time is in same day and hour of next month', () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-02-01T14:00:00Z');
    
    expect(() =>
      service.scheduleAppointment({
        patientId: 1,
        startTime,
        endTime,
      })
    ).toThrowError(
      "appointment's endTime should be in the same day as start time's"
    );
  });

  it('should throw an error when end time is in same day, hour and month of the next year', () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2023-01-01T14:00:00Z');
    
    expect(() =>
      service.scheduleAppointment({
        patientId: 1,
        startTime,
        endTime,
      })
    ).toThrowError(
      "appointment's endTime should be in the same day as start time's"
    );
  });
});
