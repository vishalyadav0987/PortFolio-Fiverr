import React, { useEffect } from 'react'
import HeroSectionGig from '../../Components/HeroSectionGig/HeroSectionGig';

const MyGigs = ({setDropdownOpen,setShowReviewModal,showReviewModal}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);

  return (
    <div id='my-gig-page' onClick={() => setDropdownOpen(false)}>
      <HeroSectionGig
      setShowReviewModal={setShowReviewModal}
      showReviewModal={showReviewModal}
      />
    </div>
  )
}

export default MyGigs
