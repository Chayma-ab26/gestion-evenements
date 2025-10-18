# TODO: Activate Reservation Functionality in Frontend

## Tasks
- [x] Update app.config.ts to properly configure AuthInterceptor
- [x] Update reservation.model.ts to match backend ReservationDTO
- [x] Update reservation.service.ts for correct endpoint and params
- [x] Update event-list.component.ts participateEvent method
- [ ] Test reservation creation with backend

## Details
- Ensure AuthInterceptor adds JWT token automatically to requests
- Align Reservation interface with backend {eventId, nbParticipants}
- Change service to POST to /reservations/create without manual token
- Prompt user for nbParticipants in participateEvent
- Verify backend runs on 8070 and frontend proxy is correct
