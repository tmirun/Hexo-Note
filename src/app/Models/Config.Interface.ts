export interface Config {
  // Site
  title?: string;
  subtitle?: string;
  description?: string;
  keywords?: string;
  author?: string;
  language?: string;
  timezone?: string;

  // URL
  url?: string;
  root?: string;
  permalink?: string;
  permalink_defaults?: string;

  // Directory
  source_dir?: string;
  public_dir?: string;
  tag_dir?: string;
  archive_dir?: string;
  category_dir?: string;
  code_dir?: string;
  i18n_dir?: string;
  skip_render?: any;

  // Writing
  new_post_name?: string;
  default_layout?: string;
  titlecase?: boolean;
  external_link?: boolean;
  filename_case?: number;
  render_drafts?: boolean;
  post_asset_folder?: boolean;
  relative_link?: boolean;
  future?: boolean;
  highlight?: {
    enable?: boolean;
    line_number?: boolean;
    auto_detect?: boolean;
    tab_replace?: boolean;
  };

  // Home page setting
  index_generator ?: {
    path?: string;
    per_page?: number;
    order_by?: string;
  };

  // Category & Tag
  default_category?: string;
  category_map?: any;
  tag_map?: any;

  // Date / Time format
  date_format?: string;
  time_format?: string;

  // Pagination
  // Set per_page to 0 to disable pagination
  per_page?: number;
  pagination_dir?: string;

  // Extensions
    theme?: string;

  // Deployment
  deploy?: {
    type?: string;
    repo?: string;
  };
}
