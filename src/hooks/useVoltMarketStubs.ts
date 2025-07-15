// Stub implementations for all VoltMarket hooks that don't have database tables yet

export const useVoltMarketDocuments = () => ({
  documents: [],
  loading: false,
  uploadDocument: async () => ({ success: true }),
  fetchDocuments: async () => {},
  deleteDocument: async () => ({ success: true })
});

export const useVoltMarketDueDiligence = () => ({
  dueDiligenceData: [],
  loading: false,
  fetchDueDiligenceData: async () => {},
  submitDueDiligenceRequest: async () => ({ success: true })
});

export const useVoltMarketLOI = () => ({
  lois: [],
  loading: false,
  fetchLOIs: async () => {},
  submitLOI: async () => ({ success: true }),
  updateLOIStatus: async () => ({ success: true })
});

export const useVoltMarketListings = () => ({
  listings: [],
  loading: false,
  fetchListings: async () => {},
  createListing: async () => ({ success: true }),
  updateListing: async () => ({ success: true }),
  deleteListing: async () => ({ success: true })
});

export const useVoltMarketPortfolio = () => ({
  portfolio: [],
  loading: false,
  fetchPortfolio: async () => {},
  addToPortfolio: async () => ({ success: true }),
  removeFromPortfolio: async () => ({ success: true })
});

export const useVoltMarketRealtime = () => ({
  realtimeData: null,
  connected: false,
  subscribe: () => {},
  unsubscribe: () => {}
});

export const useVoltMarketReviews = () => ({
  reviews: [],
  loading: false,
  fetchReviews: async () => {},
  submitReview: async () => ({ success: true })
});

export const useVoltMarketSavedSearches = () => ({
  savedSearches: [],
  loading: false,
  fetchSavedSearches: async () => {},
  saveSearch: async () => ({ success: true }),
  deleteSavedSearch: async () => ({ success: true })
});

export const useVoltMarketVerification = () => ({
  verificationStatus: null,
  loading: false,
  submitVerification: async () => ({ success: true }),
  fetchVerificationStatus: async () => {}
});

export const useVoltMarketWatchlist = () => ({
  watchlist: [],
  loading: false,
  fetchWatchlist: async () => {},
  addToWatchlist: async () => ({ success: true }),
  removeFromWatchlist: async () => ({ success: true })
});

export const useVoltMarketWebSocket = () => ({
  socket: null,
  connected: false,
  connect: () => {},
  disconnect: () => {},
  emit: () => {},
  on: () => {}
});