import React from "react";

export default function TopicsSkeleton({ count }) {
	return (
		<>
			{Array.from({ length: count }, (_, index) => (
				<div className="topic-skeleton-container">
					<div key={index}>
						<div className="skeleton-topic-flex">
							<div className="skeleton-topic"></div>
							<div>|</div>
							<div className="skeleton-topic"></div>
						</div>

						<div className="skeleton-topic-1"></div>
						<div className="skeleton-topic-2"></div>

						<div className="skeleton-topic-flex">
							<div className="skeleton-topic-round"></div>
							<div className="skeleton-topic-round"></div>
						</div>
					</div>
				</div>
			))}
		</>
	);
}
