// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React from 'react'
import { HomeFooter, HomeHeader } from '../../components'
import { Element } from 'react-scroll'
import { Grid } from '@mui/material'

export default function Aboutus ({}) {
  return (
    <div>
      <HomeHeader />
      <Element name='Element1' className='element height75Mobile'>
        <section className='aboutus'>
          <div className='container height100 d-flex  justify-content-center align-items-center'>
            <Grid container justifyContent={'center'}>
                <div className='text-center mt-5'>
                  <p className={'text-white text-center font-bold font-36'}>About Us</p>
                </div>
            </Grid>
          </div>
        </section>
      </Element>
      <section className='bg-white'>
        <div className='container'>
          <Grid container>
            <div className='text_primary text-justify'>
              <br />
              Welcome to the QoreID website “the Website”, an online resource
              owned and controlled by QoreID and/or its affiliated and related
              companies “QoreID”. Your use of this website is subject to the
              terms and conditions set out in these Terms of Use. If you do not
              agree to these Terms of Use, you may not use or access the
              Website. QoreID reserves the right to modify the content on the
              Website at any time as well as to modify these Terms of Use. By
              continuing to use or access the Website you indicate your
              acceptance of these terms and agree to be bound by any such
              modified Terms of Use. If you do not agree to any new or modified
              Terms of Use, you may not continue using the Website.
              <br />
              <br />
              1. USE OF CONTENT ON THE WEBSITE
              <br />
              <br />
              You may view, download, print or display contents from the Website
              provided that your use is for information purposes of a personal
              and non-commercial nature only and provided that you retain all
              copyright and other notices found in the original content. You may
              not modify or alter the contents of the Website in any way, or
              reproduce, republish, perform, distribute or display the contents
              of this Website for any public or commercial purpose. You may not
              use the contents of the Website to prepare any derivative work.
              You may not frame, enclose or extract any trademark, image, text,
              form or other proprietary information in the Website without
              written permission from QoreID. You may not use the word “QoreID”
              or a derivative thereof as a meta tag or hidden text without
              written permission from QoreID, nor may you use QoreID”s logo or
              other trademarks as part of any link. Any use of the contents of
              the Website on any other website is prohibited. Use of the website
              does not entitle you to any rights of ownership in the content and
              you expressly acknowledge that QoreID retains all its rights in
              the Website. Should your use of the Website not be in accordance
              with these Terms of Use, you must immediately cease using the
              Website and you must destroy any downloaded or printed material.
              <br />
              <br />
              2. SUBMITTING INFORMATION TO THE WEBSITE
              <br />
              <br />
              QoreID may decide to provide an interface for users to post
              comments, discussions or other content on the Website. QoreID does
              not want to receive confidential or proprietary information from
              you through the Website. Therefore, any information you submit or
              post to the Website will be considered non-confidential and
              nonproprietary. You must not submit information that is obscene,
              illegal, threatening or defamatory or submit comments that
              infringe the privacy or intellectual property rights of a third
              party. You may not submit any form of spam, virus or mass mail to
              the Website, and you may not provide misleading information as to
              your identity. By submitting any information you expressly grant
              to QoreID a non-exclusive, royalty-free, perpetual, irrevocable
              and sublicensable right to reproduce, use, adapt, publish, modify
              and distribute such content anywhere in the world. You warrant
              that information you submit is accurate and that you have the
              permission to submit it.
            </div>
          </Grid>
        </div>
      </section>
      <HomeFooter showCOntactUsMobile />
    </div>
  )
}
