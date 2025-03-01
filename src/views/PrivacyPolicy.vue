<template>
  <div class="privacy-policy-container">
    <div class="privacy-policy-box">
      <header class="policy-header">
        <h1>Privacy Policy</h1>
        <p class="update-date">Last Updated: {{ lastUpdated }}</p>
      </header>

      <div class="content-wrapper">
        <section>
          <h2>Introduction</h2>
          <p>Welcome to ELSTY API. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.</p>
        </section>
    
        <section>
          <h2>Information We Collect</h2>
          <p>We may collect personal data such as your email, IP address, and usage data when you use our API services.</p>
        </section>
    
        <section>
          <h2>How We Use Your Information</h2>
          <ul>
            <li>To To personalize your experience on our platform
.</li>
            <li>To provide and improve our services.</li>
            <li>To communicate updates and support.</li>
            <li>To ensure security and prevent fraud.</li>
          </ul>
        </section>
    
        <section>
          <h2>Protection of Your Information</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information. Your personal information is stored in secure networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential.</p>
        </section>
    
        <section>
          <h2>Third-Party Services</h2>
          <p>ELSTY API may use third-party services for analytics, payments, or authentication. These services have their own privacy policies.</p>
        </section>
    
        <section>
          <h2>Changes to This Policy</h2>
          <p>ELSTY API reserves the right to update or change our Privacy Policy at any time. If we make any material changes to this policy, we will notify you either through the email address you have provided us, or by placing a prominent notice on our website.</p>
        </section>
    
        <section>
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <a href="support@elsty.xyz">support@elsty.xyz</a>.</p>
        </section>
      </div>

      <router-link to="/" class="back-home">
         Back to Home
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lastUpdated: "February 2025", // Bisa diperbarui secara dinamis jika diinginkan
    };
  },
};
</script>

<style scoped>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #1e90ff; /* Blue for professional tone */
  --background-light: #f4f7fb; /* Light, clean background */
  --text-dark: #333; /* Dark for better readability */
  --text-muted: #888; /* Soft gray for less important text */
  --link-color: #1e90ff; /* Link color */
  --link-hover-color: #1177cc; /* Darker blue on hover */
}

/* Privacy Policy Container */
.privacy-policy-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.privacy-policy-box {
  padding: 2.3rem;
  width: 100%;
  max-width: 720px;
}

/* Header Styling */
.policy-header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  font-weight: 700;
}

.update-date {
  color: var(--text-muted);
  font-size: 1rem;
}

/* Section Styling */
section {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--dash-color);
  border-radius: 15px;
}
section:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  transform: translateY(-5px);
  transition: transform 0.5s, transform 0.5s;
}

h2 {
  font-size: 1.6rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  font-weight: 600;
}

p {
  color: var(--texttra-color);
  font-size: 1rem;
  line-height: 1.6;
}

ul {
  list-style-type: none;
  padding-left: 1.5rem;
}

li {
  position: relative;
  margin-bottom: 1rem;
  color: var(--texttra-color);
}

li::before {
  content: '•';
  position: absolute;
  left: -10px;
  color: var(--texttra-color);
  font-size: 1.2rem;
}

/* Back to Home Button */
.back-home {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
  padding: 0.8rem 1.6rem;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s ease;
}

.back-home:hover {
  background: var(--link-hover-color);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .privacy-policy-box {
    padding: 2rem;
  }

  h1 {
    font-size: 2.2rem;
  }

  h2 {
    font-size: 1.4rem;
  }

  p, li {
    font-size: 0.95rem;
  }
}
</style>