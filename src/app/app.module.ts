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
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HexoService } from './services/hexo.service';
import { PostComponent } from './pages/dashboard/post/post.component';
import { PostService } from './services/post.service';
import { HexoInitGuard } from './guard/hexo-init.guard';
import { PostDetailComponent } from './pages/dashboard/post/post-detail/post-detail.component';
import { SystemSettingsService } from './services/system-settings.service';
import { SettingsComponent } from './pages/dashboard/settings/settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigService } from './services/config.service';
import { UtilsService } from './services/utils.service';
import { NewPostFormComponent } from './components/new-post-form/new-post-form.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    SidebarComponent,
    DashboardComponent,
    PostComponent,
    PostDetailComponent,
    SettingsComponent,
    NewPostFormComponent
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
    ElectronService,
    HexoService,
    PostService,
    ConfigService,
    SystemSettingsService,
    UtilsService,
    HexoInitGuard,
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
