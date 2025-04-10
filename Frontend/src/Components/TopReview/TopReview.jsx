import React from 'react'
import './TopReview.css'
import useFetchAllReview from '../../CustomHook/useFetchAllReview'
import { format } from 'date-fns'

const TopReview = () => {
  const { allReviews, loading } = useFetchAllReview();
  const topReviews = allReviews?.filter((rev, i, arr) => {
    const isHighQuality = rev.rating > 4 && rev.comment?.length > 26;
    // const isFirstByUser = arr.findIndex(r => r.user._id === rev.user._id) === i;
    // return isHighQuality && isFirstByUser;
    return isHighQuality;
  });
  // console.log(topReviews);

  return (
    <>
      <section id="topreview">
        <div className="topreview-container">
          <h2>Top-tier teams use and <span>love VY</span></h2>
          <div className="topreview-box">
            {
              topReviews?.slice(0, 4)?.map((rev, i) => {
                return (
                  <div className="topreview" key={i}>
                    <p>{rev?.comment}</p>
                    <div className="topreview-info">
                      <div className='topreview-name'>
                        <p>{rev?.user.name}</p>
                        <p>{format(new Date(rev?.createdAt), 'MM/dd/yyyy hh:mm a')}</p>
                      </div>
                      <img width={"50px"} height={"50px"} src={rev?.avatar || "https://as2.ftcdn.net/jpg/03/56/07/29/1000_F_356072987_HuG91XTgcsynCj0jzBwKLMJQMZhsL0iS.jpg"} alt="" />
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </section>
    </>
  )
}

export default TopReview
