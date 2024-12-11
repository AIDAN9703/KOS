import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { FaStar } from 'react-icons/fa';
import Image from 'next/image';
import { bookingApi } from '@/services/api';
import { Review, ReviewStats } from '@/types/review';
import Link from 'next/link';

interface BoatReviewsProps {
  boatId: number;
}

export default function BoatReviews({ boatId }: BoatReviewsProps) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['boat-reviews', boatId],
    queryFn: () => bookingApi.getBoatReviews(boatId)
  });

  const { data: reviewStats } = useQuery({
    queryKey: ['boat-review-stats', boatId],
    queryFn: () => bookingApi.getBoatReviewStats(boatId)
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 h-40 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Guest Reviews</h2>
        <Link 
          href={`/boats/${boatId}/review`}
          className="text-[#21336a] hover:text-[#21336a]/80 font-medium"
        >
          Write a Review
        </Link>
      </div>
      
      {/* Reviews Summary */}
      {reviewStats?.data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-8">
          <div>
            <div className="text-2xl font-bold text-[#21336a]">
              {reviewStats.data.averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Overall Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#21336a]">
              {reviewStats.data.totalReviews}
            </div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
          <div className="col-span-2">
            <div className="space-y-2">
              {Object.entries(reviewStats.data.ratingDistribution).reverse().map(([rating, count]) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-8">{rating}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#21336a]" 
                      style={{ 
                        width: `${(count / reviewStats.data.totalReviews) * 100}%` 
                      }} 
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews?.data && reviews.data.length > 0 ? (
          reviews.data.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src={review.user.profileImage || '/images/default-avatar.png'}
                      alt={review.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {review.user.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(review.createdAt), 'MMMM yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-[#21336a]">
                    {review.rating}
                  </span>
                  <FaStar className="text-yellow-400 w-5 h-5" />
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-gray-600 mt-4">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your experience!</p>
            <Link
              href={`/boats/${boatId}/review`}
              className="inline-flex items-center px-6 py-3 bg-[#21336a] text-white rounded-lg hover:bg-[#21336a]/90 transition-colors"
            >
              Write the First Review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 