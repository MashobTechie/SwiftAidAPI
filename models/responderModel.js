const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responderSchema = new Schema({
  organizationName: { type: String, required: true },
  organizationEmail: { type: String, required: true, unique: true },
  organizationContact: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  status: {
    type: String,
    enum: ['available', 'onDuty'],
    default: 'available'
  },
  currentEmergency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emergency',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Responder', responderSchema);
