// // serviceOrderRoutes.post('/create', authClient, serviceOrderController.createOrder);
// // serviceOrderRoutes.get('/status/:id', authClient, serviceOrderController.getOrderStatus);
// // serviceOrderRoutes.put('/update/:id', authProvider, serviceOrderController.updateOrder);





// // paymentRoutes.post('/process', authClient, paymentController.processPayment);
// // paymentRoutes.get('/invoice/:id', authClient, paymentController.getInvoice);
// // paymentRoutes.get('/history', authClient, paymentController.getClientPaymentHistory);
// // paymentRoutes.get('/providerHistory', authProvider.getproviderHistory);





// // reportRoutes.get('/serviceTrends', authAdmin, reportController.getServiceTrends);
// // reportRoutes.get('/providerPerformance', authAdmin, reportController.getProviderPerformance);
// // reportRoutes.get('/clientFeedback', authAdmin, reportController.getClientFeedback);





// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use your own Stripe secret key
// const ServiceRequest = require('../models/ServiceRequest');
// const Provider = require('../models/Provider');

// // Create payment session for Stripe
// exports.createPaymentSession = async (req, res) => {
//   const { requestId, amount } = req.body;

//   try {
//     const serviceRequest = await ServiceRequest.findById(requestId);
//     if (!serviceRequest) {
//       return res.status(404).json({ error: 'Service request not found' });
//     }

//     const provider = await Provider.findById(serviceRequest.providerId);
//     if (!provider) {
//       return res.status(404).json({ error: 'Service provider not found' });
//     }

//     // Create Stripe payment session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: `Service request payment for ${serviceRequest.serviceType}`,
//             },
//             unit_amount: amount * 100, // Stripe accepts the amount in cents
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${process.env.CLIENT_URL}/payment-success`,
//       cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
//     });

//     res.status(200).json({ sessionId: session.id });
//   } catch (error) {
//     console.error('Error creating Stripe payment session:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // Handle Stripe webhook for successful payment
// exports.handleStripeWebhook = async (req, res) => {
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], endpointSecret);

//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object;
//       const serviceRequestId = session.metadata.serviceRequestId;
//       const paymentAmount = session.amount_total / 100; // Convert to dollars

//       // Update the service request and provider earnings
//       const serviceRequest = await ServiceRequest.findById(serviceRequestId);
//       serviceRequest.paymentStatus = 'completed';
//       serviceRequest.paymentAmount = paymentAmount;
//       await serviceRequest.save();

//       const provider = await Provider.findById(serviceRequest.providerId);
//       provider.earnings = (provider.earnings || 0) + paymentAmount;
//       await provider.save();

//       console.log(`Payment of $${paymentAmount} received for service request ${serviceRequestId}`);
//     }

//     res.status(200).json({ received: true });
//   } catch (err) {
//     console.error('Webhook error:', err);
//     res.status(400).send(`Webhook error: ${err.message}`);
//   }
// };
// //routes for payment

// const express = require('express');
// const router = express.Router();
// const paymentController = require('../controllers/paymentController');

// // Route to create Stripe payment session
// router.post('/create-payment-session', paymentController.createPaymentSession);

// // Route to handle Stripe webhook for payment success
// router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

// module.exports = router;

// //rating controller
// const ServiceRequest = require('../models/ServiceRequest');
// const Provider = require('../models/Provider');

// // Add a rating for a service provider
// exports.addRating = async (req, res) => {
//   const { requestId, rating, feedback } = req.body;

//   try {
//     const serviceRequest = await ServiceRequest.findById(requestId);
//     if (!serviceRequest) {
//       return res.status(404).json({ error: 'Service request not found' });
//     }

//     // Ensure the service request is completed
//     if (serviceRequest.status !== 'completed') {
//       return res.status(400).json({ error: 'Service request is not completed yet' });
//     }

//     const provider = await Provider.findById(serviceRequest.providerId);
//     if (!provider) {
//       return res.status(404).json({ error: 'Provider not found' });
//     }

//     // Add rating and feedback to the provider
//     const newRating = {
//       rating,
//       feedback,
//       customerId: serviceRequest.clientId,
//     };

//     provider.ratings.push(newRating);
//     await provider.save();

//     // Update service request with rating status
//     serviceRequest.ratingGiven = true;
//     await serviceRequest.save();

//     res.status(200).json({ message: 'Rating submitted successfully' });
//   } catch (error) {
//     console.error('Error adding rating:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // Get average rating of the provider
// exports.getProviderRating = async (req, res) => {
//   const { providerId } = req.params;

//   try {
//     const provider = await Provider.findById(providerId);
//     if (!provider) {
//       return res.status(404).json({ error: 'Provider not found' });
//     }

//     const ratings = provider.ratings;
//     const totalRatings = ratings.length;
//     const averageRating = totalRatings
//       ? ratings.reduce((acc, rating) => acc + rating.rating, 0) / totalRatings
//       : 0;

//     res.status(200).json({ averageRating });
//   } catch (error) {
//     console.error('Error fetching provider rating:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };



// //rating routes

// const express = require('express');
// const router = express.Router();
// const ratingController = require('../controllers/ratingController');

// // Route to add rating for a provider
// router.post('/add-rating', ratingController.addRating);

// // Route to get the average rating of a provider
// router.get('/provider-rating/:providerId', ratingController.getProviderRating);

// module.exports = router;

