const mongoose = require('mongoose');

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'your-mongodb-uri');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Service Schema
const ServiceSchema = new mongoose.Schema({
  name: String,
  slug: String,
  shortDescription: String,
  longDescription: String,
  features: [String],
  faqs: [{ question: String, answer: String }],
  image: String,
  gallery: [String],
  status: String,
}, { timestamps: true });

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

// Fetch and display all services
const fetchServices = async () => {
  await connectDB();
  
  const services = await Service.find().lean();
  
  console.log('\n=== ALL SERVICES DATA ===\n');
  
  services.forEach((service, index) => {
    console.log(`\n--- SERVICE ${index + 1} ---`);
    console.log('Name:', service.name);
    console.log('Short Description:', service.shortDescription);
    console.log('Long Description:', service.longDescription);
    console.log('\nFeatures:');
    service.features.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
    console.log('\nFAQs:');
    service.faqs.forEach((faq, i) => {
      console.log(`  Q${i + 1}: ${faq.question}`);
      console.log(`  A${i + 1}: ${faq.answer}`);
    });
    console.log('\n' + '='.repeat(80));
  });
  
  mongoose.connection.close();
};

fetchServices();
