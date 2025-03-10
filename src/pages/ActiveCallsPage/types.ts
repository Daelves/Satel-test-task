export interface Call {
  id: string;
  callsId: string;
  recording: boolean;
  appealsId: string;
  callsStartTime: string;
  phoneNumbers: string[];
  radioStationId?: string;
}

export interface ListeningCall extends Call {
  duration: string;
  isRecording: boolean;
  radioStationId?: string;
}
