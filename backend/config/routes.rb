Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    resources :leads, only: :create
    resources :event_types, only: :index
    resources :projects, only: :index
    resources :equipment, only: :index
    resources :equipment_categories, only: :index

    namespace :admin do
      resources :leads, only: %i[index update]
      resources :event_types, only: %i[index create update destroy]
      resources :projects, only: %i[index create update destroy]
      resources :equipment, only: %i[index create update destroy]
      resources :equipment_categories, only: %i[index create update destroy]
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
