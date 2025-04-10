import React from "react";
import "./SingleGigTable.css";
import { FaCheck } from "react-icons/fa6";

const SingleGigTable = ({ singleGig }) => {

  return (
    <div className="single-gig-container">
      <table className="single-gig-table">
        <thead>
          <tr>
            <th>Package</th>
            {singleGig?.PricingPlans?.map((pkg, index) => (
              <th key={index}>
                <p className="single-gig-price">₹{pkg?.price}</p>
                <h3 className="single-gig-name">{pkg?.planType}</h3>
                <p className="single-gig-desc">{pkg?.title}{""}{pkg?.shortDescription}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {singleGig?.PricingPlans?.[0]?.features?.map((fe, i) => (
            <tr key={i}>
              <td style={{fontSize:"14px",opacity:"0.7"}}>{fe}</td>
              {singleGig?.PricingPlans?.map((plan, index) => (
                <td key={index} className="single-gig-icon">
                  {plan.features.includes(fe) ? (
                    <FaCheck className="single-gig-check" />
                  ) : (
                    <span style={{color:"red"}}>✖</span> // Agar feature nahi hai to cross dikhao
                  )}
                </td>
              ))}
            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
};

export default SingleGigTable;
