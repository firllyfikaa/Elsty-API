<template>
  <div class="faq-container">
    <h2 class="faq-title">Frequently Asked Questions</h2>
    <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
      <button @click="toggleFaq(index)" class="faq-question">
        {{ faq.question }}
        <span
          class="material-symbols-rounded faq-icon"
          :class="{ 'rotated': activeIndex === index }"
        >
          expand_more
        </span>
      </button>
      <transition name="slide-fade">
        <div v-if="activeIndex === index" class="faq-answer">
          <p v-html="faq.answer"></p>
          <div v-if="faq.benefits" class="benefits-list">
            <div v-for="(benefit, i) in faq.benefits" :key="i" class="benefit-item">
              <span class="material-symbols-rounded">check_circle</span>
              <strong>{{ benefit }}</strong>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: null,
      faqs: [
        {
          question: "What is Elsty?",
          answer: `Elsty is a powerful API platform with 42 available endpoints, offering seamless integration. <br><br>Some benefits include:`,
          benefits: [
            "No Ads",
            "High Speed",
            "Supports Multiple Platforms",
            "Quality Selector",
            "Easy-to-Use API Integration",
          ],
        },
        {
          question: "Is there a usage limit for the API?",
          answer: "No! You can make unlimited requests to this API.",
        },
        {
          question: "Is Elsty free to use?",
          answer: "Yes, Elsty provides free API access with no hidden fees. Premium features may be introduced in the future.",
        },
        {
          question: "How do I send a request to Elsty?",
          answer: "You can send requests using HTTP methods such as POST, GET, PUT, or CURL.",
        },
        {
          question: "What is an endpoint?",
          answer: "An endpoint is a specific URL where an API can be accessed to perform operations.",
        },
        {
          question: "How can I learn more about using the API?",
          answer: "You can check the official documentation available on the Elsty website.",
        },
      ],
    };
  },
  methods: {
    toggleFaq(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },
  },
};
</script>

<style scoped>
/* FAQ Container */
.faq-container {
  max-width: 650px;
  margin: auto;
  padding: 24px;
}

/* FAQ Title */
.faq-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 20px;
}

/* FAQ Item */
.faq-item {
  padding: 12px 0;
}

/* FAQ Question */
.faq-question {
  width: 100%;
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 18px;
  font-weight: 600;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
  border-radius: 8px;
}

.faq-question:hover {
  background: var(--bg-color);
}

/* FAQ Answer */
.faq-answer {
  padding: 10px 18px;
  font-size: 16px;
  color: #64748b;
  line-height: 1.6;
  border-left: 4px solid #6366f1;
  border-radius: 6px;
  margin-top: 8px;
}

/* Benefits List */
.benefits-list {
  margin-top: 12px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #374151;
  padding: 6px 0;
}

.benefit-item span {
  color: #10b981;
  font-size: 20px;
}

/* FAQ Icon Rotation */
.faq-icon {
  font-size: 24px;
  transition: transform 0.3s ease;
}

.faq-icon.rotated {
  transform: rotate(180deg);
}

/* Slide and Fade Effect */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>