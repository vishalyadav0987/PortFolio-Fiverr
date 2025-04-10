import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./SingleFAQ.css";

const SingleFAQ = ({singleGig}) => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = singleGig?.FAQ

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="single-gig-faq">
      {faqs?.map((faq, index) => (
        <div key={index} className="single-gig-faq-item">
          <div className="single-gig-faq-question" onClick={() => toggleFAQ(index)}>
            <span>{faq.question}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </motion.div>
          </div>
          <motion.div
            initial={false}
            animate={openIndex === index ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="single-gig-faq-answer-container"
          >
            <div className="single-gig-faq-answer">{faq.answer}</div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default SingleFAQ;
