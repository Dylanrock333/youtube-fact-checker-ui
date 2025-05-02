
const sendEmail = async (formData) => {
  const formspreeEndpoint = 'https://formspree.io/f/mgvkavbd';
  
  try {
    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Form submission failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending form:', error);
    throw error;
  }
};

export default sendEmail;
