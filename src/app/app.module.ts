import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

/**
 * register language package
 */
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);
import { NZ_I18N, en_US } from 'ng-zorro-antd';
import { MarkdownModule } from 'ngx-markdown';


// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './services/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HexoService } from './services/hexo.service';
import { ArticleComponent } from './pages/dashboard/article/article.component';
import { ArticleService } from './services/article.service';
import { HexoInitGuard } from './guard/hexo-init.guard';
import { ArticleDetailComponent } from './pages/dashboard/article/article-detail/article-detail.component';
import { SystemSettingsService } from './services/system-settings.service';
import { SettingsComponent } from './pages/dashboard/settings/settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigService } from './services/config.service';
import { UtilsService } from './services/utils.service';
import { ServerService } from './services/server.service';
import { NewArticleFormComponent } from './components/new-article-form/new-article-form.component';
import { CanDeactivateGuard } from './guard/can-deactivate.guard';
import { AppInitGuard } from './guard/app-init.guard';
import { ArticleListItemComponent } from './components/article-list-item/article-list-item.component';
import { RenameArticleModalComponent } from './components/rename-article-modal/rename-article-modal.component';
import { SaveArticleImageModalComponent } from './components/save-article-image-modal/save-article-image-modal.component';
import { AssetService } from './services/asset.service';
import { ArticleMdEditorComponent } from './components/article-md-editor/article-md-editor.component';
import { CustomMdEditorComponent } from './components/custom-md-editor/custom-md-editor.component';
import { NotProjectFoundComponent } from './pages/not-project-found/not-project-found.component';
import { NewBlogModalComponent } from './components/new-blog-modal/new-blog-modal.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    WebviewDirective,
    SidebarComponent,
    DashboardComponent,
    ArticleComponent,
    ArticleDetailComponent,
    SettingsComponent,
    NewArticleFormComponent,
    ArticleListItemComponent,
    RenameArticleModalComponent,
    SaveArticleImageModalComponent,
    ArticleMdEditorComponent,
    CustomMdEditorComponent,
    NotProjectFoundComponent,
    NewBlogModalComponent,
  ],
  entryComponents: [
    RenameArticleModalComponent,
    SaveArticleImageModalComponent,
    NewBlogModalComponent,
    NewArticleFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    FlexLayoutModule,
    CodemirrorModule,
    MarkdownModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AssetService,
    ElectronService,
    HexoService,
    ArticleService,
    ConfigService,
    SystemSettingsService,
    UtilsService,
    HexoInitGuard,
    CanDeactivateGuard,
    AppInitGuard,
    ServerService,
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
